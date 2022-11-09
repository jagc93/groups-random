import { Component, HostListener } from '@angular/core';
import Excel from './classes/excel.classes';
import Pdf from './classes/pdf.classes';
import { IsFileTypeValid } from './functions/file.functions';
import { RandomNumber } from './functions/numer-random.funtions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public itemsPerPage = 10;
  public page = 1;
  public isLoading = false;
  private file!: File | undefined;
  public items!: string[] | undefined;
  public matchmaking!: string[][] | undefined;
  public msn = {
    isError: true,
    isInfo: false,
    isSuccess: false,
    show: false,
    description: ''
  }

  private dataFiles!: string[][][] | undefined;
  private pdf = new Pdf();
  private clintonList = [
    {
      person: 'Brayan Steven Sanchez Cuellar',
      notAllowed: [
        'Diana Marcela Florez Riascos'
      ]
    },
    {
      person: 'Diana Marcela Florez Riascos',
      notAllowed: [
        'Brayan Steven Sanchez Cuellar'
      ]
    },
    {
      person: 'Carolina O. Garcia',
      notAllowed: [
        'Juan Camilo Tangarife Tamayo'
      ]
    },
    {
      person: 'Juan Camilo Tangarife Tamayo',
      notAllowed: [
        'Carolina O. Garcia'
      ]
    }
  ]

  @HostListener('change', ['$event']) emitFiles( event: any ) {
    const target = event.target as DataTransfer;
    if (!this.isInvalidFileType('csv', target.files.item(0))) {
      this.file = target.files.item(0) as File;
    } else {
      this.alert('Dear user, only csv type files are allowed, please upload a valid file.');
    }
  }

  public loadFile() {
    if (this.isLoading || !this.file) {
      return;
    }

    this.isLoading = true;

    setTimeout(async () => {
      await this.importCSV(this.file as File);
      this.isLoading = false;
    }, 100);
  }

  public startGroups() {
    if (this.isLoading || !this.dataFiles) {
      return;
    } else if (this.dataFiles[0].length % 2 !== 0) {
      this.alert('Dear user, the number of people is not valid, you need to add or delete 1 more record.');
      return;
    }

    this.isLoading = true;

    const data = this.dataFiles[0];
    const matchmaking: string[][] = [];
    let couple: string[];
    let position: number;

    data.forEach((item, idx) => {
      couple = [item.join('|')];

      position = RandomNumber(0, data.length - 1);

      do {
        position = RandomNumber(0, data.length - 1);
        if (position !== idx && !matchmaking.map(friends => { return friends.length > 1 ? friends[1] : '' }).includes(data[position].join('|'))
        && !this.isBetado(item.join('|'), data[position].join('|'))) {
          couple.push(data[position].join('|'));
        }
      } while(couple.length < 2);
      matchmaking.push(couple);

      if (idx === data.length - 1) {
        this.matchmaking = matchmaking;
        this.alert('People have been correctly matched.', false);
        this.isLoading = false;
      }
    });
  }

  public async exportFileByCouple() {
    if (!this.matchmaking || this.matchmaking.length === 0) {
      return;
    }

    this.isLoading = true;
    this.alert('Dear user, please wait while the download finishes.', false, true);
    await this.pdf.generateFileByCouple(this.matchmaking);
    this.alert('Download completed successfully', false);
    this.isLoading = false;
  }

  public cancel() {
    this.file = undefined;
    this.items = undefined;
    this.matchmaking = undefined;
    this.msn = {
      isError: true,
      isInfo: false,
      isSuccess: false,
      show: false,
      description: ''
    };

    this.dataFiles = undefined;
  }

  private isInvalidFileType(type: string, file: File | null): boolean {
    return !IsFileTypeValid(type, file);
  }

  private importCSV(file: File): Promise<void> {
    return new Promise<void>(async resolve => {
      const excel = new Excel();
      this.dataFiles = await excel.getDataFiles(file);
      if (this.dataFiles[0].length % 2 === 0) {
        this.items = this.dataFiles[0].map(item => item.join(' '));
        this.alert('Records successfully uploaded.', false);
        resolve();
      } else {
        this.alert('Dear user, the number of people is not valid, you need to add or delete 1 more record.');
        resolve();
      }
    });
  }

  private alert(description: string, isError = true, isInfo = false) {
    this.msn.description = description;
    this.msn.isError = isError;
    this.msn.isSuccess = !isError && !isInfo;
    this.msn.show = true;
    this.msn.isInfo = isInfo;
  }

  private isBetado(person: string, friend: string) {
    return (this.clintonList.map(clinton => clinton.person.toUpperCase()).includes(person.toUpperCase())
    && (this.clintonList.find(clinton => clinton.person.toUpperCase() === person.toUpperCase()) as { person: string, notAllowed: string[] }).notAllowed.includes(friend));
  }
}
