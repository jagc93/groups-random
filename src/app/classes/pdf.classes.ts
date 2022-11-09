import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as pdfMake from 'pdfmake/build/pdfmake';

class Pdf {

    constructor() {
        (window as any).pdfMake.vfs = pdfFonts.pdfMake.vfs;
    }

    public async generateFileByCouple(data: string[][]) {
        return new Promise<void>(resolve => {
            if (data.length === 0) {
                resolve();
            }
            const docsDefinition: { fullName: string, pdf: pdfMake.TCreatedPdf }[] = [];
            data.forEach(async (couple, idx) => {
                docsDefinition.push({
                    fullName: `${couple[0].split('|')[0].toUpperCase()}`,
                    pdf: pdfMake.createPdf(this.getDocDefinition(couple) as any)
                });
    
                if (idx === data.length - 1) {
                    await this.downloadFiles(docsDefinition);
                    resolve();
                }
            });
        });
    }

    private getDocDefinition(couple: string[]) {
        return {
            content: [
                {
                    text: 'JUEGO AMIG@ SECRETO',
                    style: 'header'
                },
                {
                    text: `${couple[0].split('|')[0]}, su amig@ secreto es:`,
                    style: 'subheader',
                    margin: [0, 20]
                },
                '\n\n\n\n',
                {
                    text: `${couple[1].split('|')[0].toUpperCase()}`,
                    style: 'header',
                    color: '#0dcaf0',
                    margin: [0, 20]
                }
            ],
            styles: {
                header: {
                    fontSize: 30,
                    bold: true,
                    alignment: 'center'
                },
                subheader: {
                    fontSize: 20,
                    bold: true
                }
            }
        };
    }

    private downloadFiles(docsDefinition: { fullName: string, pdf: pdfMake.TCreatedPdf }[]): Promise<void> {
        return new Promise<void>(resolve => {
            docsDefinition.forEach((data, idx) => {
                setTimeout(() => {
                    data.pdf.download(data.fullName);
                    if (idx === docsDefinition.length - 1) {
                        resolve();
                    }
                }, 500 * idx);
            });
        });
    }
}

export default Pdf;
