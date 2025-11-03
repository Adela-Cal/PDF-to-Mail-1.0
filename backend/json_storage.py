"""
JSON-based storage module for Speedy Statements
Replaces MongoDB with local JSON file storage
"""
import json
import os
from pathlib import Path
from typing import List, Dict, Any, Optional
import asyncio
from datetime import datetime


class JSONStorage:
    """Async JSON storage that mimics MongoDB operations"""
    
    def __init__(self, data_dir: Optional[str] = None):
        """
        Initialize JSON storage
        
        Args:
            data_dir: Directory to store JSON files. If None, uses %APPDATA%/SpeedyStatements/data
        """
        if data_dir is None:
            # Use Windows AppData for production, fallback to temp for development
            if os.name == 'nt':  # Windows
                appdata = os.environ.get('APPDATA', os.path.expanduser('~'))
                self.data_dir = Path(appdata) / 'SpeedyStatements' / 'data'
            else:  # Linux/Mac for development
                self.data_dir = Path.home() / '.speedystatements' / 'data'
        else:
            self.data_dir = Path(data_dir)
        
        # Create data directory if it doesn't exist
        self.data_dir.mkdir(parents=True, exist_ok=True)
        
        # Initialize collection files
        self.collections = {
            'email_templates': self.data_dir / 'templates.json',
            'email_accounts': self.data_dir / 'accounts.json'
        }
        
        # Create empty files if they don't exist
        for collection_file in self.collections.values():
            if not collection_file.exists():
                self._write_file(collection_file, [])
    
    def _read_file(self, file_path: Path) -> List[Dict[str, Any]]:
        """Read JSON file and return data"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return []
    
    def _write_file(self, file_path: Path, data: List[Dict[str, Any]]) -> None:
        """Write data to JSON file"""
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    
    async def find(self, collection: str, query: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """
        Find documents in collection
        
        Args:
            collection: Collection name (e.g., 'email_templates')
            query: Query filter (e.g., {'id': '123'})
        
        Returns:
            List of matching documents
        """
        # Run in thread pool to keep async interface
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self._find_sync, collection, query)
    
    def _find_sync(self, collection: str, query: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """Synchronous find operation"""
        file_path = self.collections.get(collection)
        if not file_path:
            return []
        
        data = self._read_file(file_path)
        
        if query is None or query == {}:
            return data
        
        # Simple query matching
        results = []
        for item in data:
            match = True
            for key, value in query.items():
                if item.get(key) != value:
                    match = False
                    break
            if match:
                results.append(item)
        
        return results
    
    async def insert_one(self, collection: str, document: Dict[str, Any]) -> Dict[str, Any]:
        """
        Insert a document into collection
        
        Args:
            collection: Collection name
            document: Document to insert
        
        Returns:
            Inserted document
        """
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self._insert_one_sync, collection, document)
    
    def _insert_one_sync(self, collection: str, document: Dict[str, Any]) -> Dict[str, Any]:
        """Synchronous insert operation"""
        file_path = self.collections.get(collection)
        if not file_path:
            raise ValueError(f"Unknown collection: {collection}")
        
        data = self._read_file(file_path)
        data.append(document)
        self._write_file(file_path, data)
        
        return document
    
    async def delete_one(self, collection: str, query: Dict[str, Any]) -> int:
        """
        Delete one document from collection
        
        Args:
            collection: Collection name
            query: Query filter to match document
        
        Returns:
            Number of deleted documents (0 or 1)
        """
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self._delete_one_sync, collection, query)
    
    def _delete_one_sync(self, collection: str, query: Dict[str, Any]) -> int:
        """Synchronous delete operation"""
        file_path = self.collections.get(collection)
        if not file_path:
            return 0
        
        data = self._read_file(file_path)
        original_length = len(data)
        
        # Find and remove first matching item
        for i, item in enumerate(data):
            match = True
            for key, value in query.items():
                if item.get(key) != value:
                    match = False
                    break
            if match:
                data.pop(i)
                break
        
        if len(data) < original_length:
            self._write_file(file_path, data)
            return 1
        return 0
    
    async def update_one(self, collection: str, query: Dict[str, Any], update: Dict[str, Any]) -> int:
        """
        Update one document in collection
        
        Args:
            collection: Collection name
            query: Query filter to match document
            update: Update operations (e.g., {'$set': {'name': 'new_name'}})
        
        Returns:
            Number of updated documents (0 or 1)
        """
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self._update_one_sync, collection, query, update)
    
    def _update_one_sync(self, collection: str, query: Dict[str, Any], update: Dict[str, Any]) -> int:
        """Synchronous update operation"""
        file_path = self.collections.get(collection)
        if not file_path:
            return 0
        
        data = self._read_file(file_path)
        
        # Find and update first matching item
        for item in data:
            match = True
            for key, value in query.items():
                if item.get(key) != value:
                    match = False
                    break
            if match:
                # Handle $set operation
                if '$set' in update:
                    item.update(update['$set'])
                else:
                    item.update(update)
                
                self._write_file(file_path, data)
                return 1
        
        return 0


class CollectionWrapper:
    """Wrapper to mimic MongoDB collection interface"""
    
    def __init__(self, storage: JSONStorage, collection_name: str):
        self.storage = storage
        self.collection_name = collection_name
    
    def find(self, query: Dict[str, Any] = None, projection: Dict[str, Any] = None):
        """
        Find documents (returns FindWrapper for chaining)
        
        Args:
            query: Query filter
            projection: Field projection (ignored for JSON storage)
        """
        return FindWrapper(self.storage, self.collection_name, query)
    
    async def insert_one(self, document: Dict[str, Any]):
        """Insert one document"""
        return await self.storage.insert_one(self.collection_name, document)
    
    async def delete_one(self, query: Dict[str, Any]):
        """Delete one document"""
        deleted_count = await self.storage.delete_one(self.collection_name, query)
        return type('DeleteResult', (), {'deleted_count': deleted_count})()
    
    async def update_one(self, query: Dict[str, Any], update: Dict[str, Any]):
        """Update one document"""
        modified_count = await self.storage.update_one(self.collection_name, query, update)
        return type('UpdateResult', (), {'modified_count': modified_count})()


class FindWrapper:
    """Wrapper to mimic MongoDB find cursor"""
    
    def __init__(self, storage: JSONStorage, collection_name: str, query: Dict[str, Any] = None):
        self.storage = storage
        self.collection_name = collection_name
        self.query = query or {}
    
    async def to_list(self, length: Optional[int] = None):
        """Convert find results to list"""
        results = await self.storage.find(self.collection_name, self.query)
        if length is not None and length > 0:
            return results[:length]
        return results


class DatabaseWrapper:
    """Wrapper to mimic MongoDB database interface"""
    
    def __init__(self, storage: JSONStorage):
        self.storage = storage
    
    def __getattr__(self, collection_name: str):
        """Get collection by attribute access"""
        return CollectionWrapper(self.storage, collection_name)
    
    def __getitem__(self, collection_name: str):
        """Get collection by item access"""
        return CollectionWrapper(self.storage, collection_name)
