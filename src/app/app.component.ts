import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public title = 'RANDOM GROUPS';
  public result: any[] = undefined;
  public game: string = '';
  public loading = false;

  public send(option: string, group: string): void {

    if (group.trim() === '') {

      return;
    }

    const groups = group.trim().split('\n');

    if (option === '1') {

      this.loading = true;

      if (groups.length % 2 !== 0) {
        alert('Falta 1 participante en el juego, ya que debe ser un número par de personas en el juego para conformar las parejas');
        this.loading = false;

        return;
      }

      let list = [];
      for(let i = 0; i < groups.length; i++) {

        if (groups[i] === '') {
          alert("Estimado usuario, el nombre del participante no puede ser vacío.");
          this.loading = false;

          return;
        }

        list.push({
          position: i + 1,
          person: groups[i],
          secret: 0,
          personSecret: undefined
        });
  
        if (i === groups.length - 1) {

          for(let j = 0; j < list.length; j++) {
  
            const random = this.getRandom(groups.length);
            const find = list.find(l => l.secret === random);
  
            if (list[j].position !== random && find === undefined) {
              list[j].secret = random;
              list[j].personSecret = list[random - 1].person;

            } else if (j === list.length - 1) {

              const f = list.find(l => l.secret === 0);

              if (f !== undefined) {

                for(let k = 1; k <= groups.length; k++) {
                  for(let l = 0; l < list.length; l++) {
                    if (list[l].secret === k) {
                      break;
                    }

                    if (l === list.length - 1) {
                      list[j].secret = k;
                      list[j].personSecret = list[k - 1].person;
                    }
                  }
                }
              }
            } else {
              j--;
            }
  
            if (j === list.length - 1) {

              (document.getElementById('groups') as HTMLInputElement).value = '';
              this.result = list;
              this.game = 'Amigo Dulce';

              setTimeout(() => {
                this.loading = false;
              }, 300);
            }
          }
        }
      }
    }
  }

  public reset(): void {
    this.game = '';
    this.result = undefined;
  }

  private getRandom(max: number) {
    return Math.floor(Math.random()*max) + 1;
  }
}
