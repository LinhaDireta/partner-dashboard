import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user';
import { environment } from '../../../environments/environment';

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
    setInterval( () => { this.list(); } , 15000);
   }

  ngOnInit() {
  }

  list() {
    this.alertSevice.list(this.currentUser.police_station_id).subscribe(alerts => {
      this.alerts = alerts;
      this.checkReads();
    });
  }

  updateStatus(alert) {
    this.audio.pause();
    this.alertSevice.updateAlert(alert.id, {email: this.currentUser.email}).subscribe( res => {
      console.log(res);
    });
    alert.logs.push({id: 1, alert_id: 28, type: 1, properties: {"email": "31bpm@ycloud.com.br"} });

  }

  checkReads() {
    const unreads = this.alerts.filter( alert => alert.logs.length === 0);

    if (this.audio.paused && unreads.length > 0) {
      this.audio.play();
    }
  }

}
