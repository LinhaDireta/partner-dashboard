import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private http: HttpClient) { }

  list(police_station_id) {
    return this.http.get(environment.api_url + `/police-station/alerts?police_station_id=${police_station_id}`);
  }

  updateAlert(alert_id, obj) {
    return this.http.post(environment.api_url + `/alert/${alert_id}/set_read`, obj);
  }
}
