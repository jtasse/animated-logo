// src/types.d.ts

type FileSystemWriteChunkType =
    | BufferSource
    | Blob
    | string
    | DataView
    | ArrayBuffer;

interface FileSystemHandle {
    kind: 'file' | 'directory';
    name: string;
    queryPermission(descriptor?: any): Promise<PermissionState>;
    requestPermission(descriptor?: any): Promise<PermissionState>;
}

interface FileSystemDirectoryHandle extends FileSystemHandle {
    getFileHandle(name: string, options?: any): Promise<FileSystemFileHandle>;
    getDirectoryHandle(name: string, options?: any): Promise<FileSystemDirectoryHandle>;
    removeEntry(name: string, options?: any): Promise<void>;
}

interface FileSystemFileHandle extends FileSystemHandle {
    getFile(): Promise<File>;
    createWritable(): Promise<FileSystemWritableFileStream>;
}

interface FileSystemWritableFileStream extends WritableStream {
    write(data: FileSystemWriteChunkType): Promise<void>;
    close(): Promise<void>;
    seek(position: number): Promise<void>;
    truncate(size: number): Promise<void>;
}

// Optional global pickers
declare function showOpenFilePicker(options?: any): Promise<FileSystemFileHandle[]>;
declare function showDirectoryPicker(options?: any): Promise<FileSystemDirectoryHandle>;
declare function showSaveFilePicker(options?: any): Promise<FileSystemFileHandle>;
