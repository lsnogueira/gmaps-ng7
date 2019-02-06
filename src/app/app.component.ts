/// <reference types="@types/googlemaps" />
//ou <reference types="googlemaps" />

import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MapsService } from './maps.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  @ViewChild('gmap') gmapElement: any;
  public map: google.maps.Map
  public lat: number = -23.569813
  public lng: number = -46.643394
  public myLatLng: Object = { lat: this.lat, lng: this.lng }
  public marker: any
  public ini: number = 0

  constructor(private mapService: MapsService) {
  
  }

  ngOnInit() {
    var mapProp = {
      center: new google.maps.LatLng(this.lat, this.lng),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    console.log(this.gmapElement)
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

  }

  setMapType(mapTypeId: string) {
    this.map.setMapTypeId(mapTypeId)
  }

  setCenter(e: any) {
    e.preventDefault();
    this.map.setCenter(new google.maps.LatLng(this.lat, this.lng));
    let latLng: Object = { lat: this.lat, lng: this.lng }
    this.setMarker(latLng)
  }

  setMarker(myLatLng: any) {
    //removendo o marker antes de setar o novo
    this.ini === 0 ? this.ini++ : this.marker.setMap(null)
    //instanciando novo marker
    this.marker = new google.maps.Marker({
      map: this.map,
      draggable: false,
      animation: google.maps.Animation.BOUNCE,
      position: myLatLng,
      icon: '../assets/heart.png',
      title: 'Cerimônia de Casamento'
    });

  }
  clearMarker() {
    this.marker = new google.maps.Marker({
      map: this.map,
      position: undefined
    })
  }

  changeAddress(address: string) {
    address = address.replace(/\s|&/g, '+')
    let fullAddress = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=YOUR_API_KEY'

    
    this.mapService.getGeolocation(fullAddress).subscribe(result => {
            
      if (Object.keys(result.results).length !== 0) {        
        this.lat = result.results[0].geometry.location.lat
        this.lng = result.results[0].geometry.location.lng
        this.myLatLng = { lat: this.lat, lng: this.lng }

        let contentString: string = '<p>Local: </p><p><b>' +
          result.results[0].formatted_address + '</b></p>' +
          '<p><a href=\"https://www.google.com/maps?q=' + this.lat + ',' + this.lng + '\">Veja no Maps</a>'

        //setando o novo local no mapa
        this.map.setCenter(new google.maps.LatLng(this.lat, this.lng))

        this.setMarker(this.myLatLng)

        //instanciando caixa de texto do marcador   
        let infoWindow = new google.maps.InfoWindow({
          content: contentString,
          disableAutoPan: true,
        })

        //adicionando evento de click no marcador do mapa
        google.maps.event.addListener(this.marker, 'click', () => {
          infoWindow.open(this.map, this.marker)
          this.toggleDrop()
        })

      } else {
        console.log('Erro ao consultar API')
        console.log(result)
      }
    }, error => {
      console.log(error)
    })

  }

  toggleDrop() {
    if (this.marker.getAnimation() !== null) {
      this.marker.setAnimation(null);
    } else {
      this.marker.setAnimation(google.maps.Animation.DROP);
    }
  }

}