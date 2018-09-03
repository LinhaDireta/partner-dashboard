import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  logout(e) {
    e.preventDefault(); // Não chama o link
    this.auth.logout();
  }

}
