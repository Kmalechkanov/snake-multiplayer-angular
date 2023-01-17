import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { StatsComponent } from './components/stats/stats.component';
import { TableComponent } from './components/playground/table.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { CreditsComponent } from './components/credits/credits.component';
import { FooterComponent } from './components/footer/footer.component';
import { ButtonComponent } from './components/button/button.component';

const config: SocketIoConfig = {
	// url: environment.socketUrl, // socket server url;
  url: '192.168.0.229:3200',
	options: {
		transports: ['websocket']
	}
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    StatsComponent,
    CreditsComponent,
    TableComponent,
    ButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent, HeaderComponent, FooterComponent]
})
export class AppModule { }
