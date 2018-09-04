import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user';
import { environment } from '../../../environments/environment';

declare let alertify: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  currentUser: User;
  alerts: any = [];
  api_root_url: any;
  audio: any = '';

  constructor(
    private alertSevice: AlertService,
    private authService: AuthService
  ) {

    this.audio = new Audio('assets/alarm.mp3');

    setInterval( () => { this.checkReads(); } , 20000);

    this.api_root_url = environment.api_root_url;
    this.currentUser = this.authService.getUser();
    this.list();
    setInterval( () => { this.list(); } , 8000);
   }

  ngOnInit() {
  }

  list() {
    this.alertSevice.list(this.currentUser.police_station_id).subscribe( (alerts: Array<any>) => {
      if (this.alerts.length === 0) {
        this.alerts = alerts;
      } else if (alerts.length > 0 && alerts[0].id !== this.alerts[0].id) {
        this.alerts = alerts;
        this.checkReads();
      }
    }, error => {
      alertify.error('Ocorreu um erro ao se comunicar com o servidor.');
    });
  }

  updateStatus(alert) {
    this.audio.pause();
    this.alertSevice.updateAlert(alert.id, {email: this.currentUser.email}).subscribe( res => {
      if (res.status === 401) {
        location.reload();
      }
      alert.logs.push({alert_id: alert.id, type: 1, properties: {email: this.currentUser.email} });
    }, error => {
      alertify.error('Ocorreu um erro ao se comunicar com o servidor.');
    });

  }

  checkReads() {
    const unreads = this.alerts.filter( alert => alert.logs.length === 0);

    if (this.audio.paused && unreads.length > 0) {
      this.audio.play();
    }
  }

}
