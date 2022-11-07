import { Workbook, Worksheet } from 'exceljs';
class Excel {

    private workbook!: Workbook;
    private worksheet!: Worksheet;

    constructor() { }

    async getDataFiles(val: DataTransfer | FileList | File) {
        return new Promise<string[][][]>(async resolve => {
            if (val instanceof File) {
                resolve([ await this.getDataFile(val) ]);
            } else {
                const fileList: FileList = val instanceof DataTransfer ? val.files : val;
                const dataFiles: string[][][] = [];
                const length = fileList.length;
                let file: File;

                if (length > 0) {
                    for (let i = 0; i < length; i++) {
                        file = fileList[i];
                        dataFiles.push(await this.getDataFile(file));

                        if (i === length - 1) {
                            resolve(dataFiles);
                        }
                    }
                } else {
                    resolve(dataFiles);
                }
            }
        });
    }

    public getDataFile(file: File) {
        return new Promise<string[][]>(resolve => {
            const fr = new FileReader();
            let arrayFilas: string[][];
            let text: string;
            let rows: string[];

            fr.onload = () => {
                text = fr.result as string;
                rows = text !== null ? text.replace('\r', '').split('\n') : [];
                arrayFilas = [];

                if (rows.length === 0) {
                    resolve(arrayFilas);
                }

                for (let i = 0; i < rows.length; i++) {
                    if (rows[i].length !== 0) {
                        arrayFilas.push(rows[i].split(';'));
                    }

                    if (i === rows.length - 1) {
                        resolve(arrayFilas);
                    }
                }
            };

            fr.readAsText(file, 'ISO-8859-4');
        });
    }
}

export default Excel;
