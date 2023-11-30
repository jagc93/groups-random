export async function IsFilesTypeValid(type: string, files: FileList | null): Promise<boolean> {
    if (files) {
        return await new Promise<boolean>(async resolve => {
            const list = await new Promise<Array<File>>(resolve => {
                const list = new Array(files.length);
                if (files.length === 0) {
                    resolve([]);
                }

                for (let i = 0; i < files.length; i++) {
                    list.push(files.item(i));
    
                    if (i === files.length - 1) {
                        resolve(list);
                    }
                }
            });

            let ext: string;
            list.forEach((file, idx) => {
                ext = file.name.split('.')[1].toLowerCase();
                if (type.toLowerCase() !== ext.toLowerCase()) {
                    resolve(false);
                }

                if (idx === list.length - 1) {
                    resolve(true);
                }
            });
        });
    } else {
        return true;
    }
}