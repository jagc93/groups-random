export function IsFileTypeValid(type: string, file: File | null): boolean {
    if (file) {
        const ext = file.name.split('.')[1].toLowerCase();
        return type.toLowerCase() === ext.toLowerCase();
    } else {
        return true;
    }
}
