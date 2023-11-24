import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridModule } from '@progress/kendo-angular-grid';
import { ReservationComponent} from './reservation/reservation.component'
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { DropdownFilterComponent } from './components/dropdown-filter/dropdown-filter.component';
import { IconsModule } from '@progress/kendo-angular-icons';
import { LabelModule } from '@progress/kendo-angular-label';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { VypujckyComponent } from './vypujcky/vypujcky.component';
import { PozadavkyComponent } from './pozadavky/pozadavky.component';
import { HttpClientModule } from '@angular/common/http';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { LoginComponent } from './login/login.component';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { CSLocaleMessageService } from './helper/cslocale-message.service'
import { MessageService } from '@progress/kendo-angular-l10n'
import "@progress/kendo-angular-intl/locales/cs/all";

import { NotificationModule } from '@progress/kendo-angular-notification';
import { GameDetailsComponent } from './game-details/game-details.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { NewUserComponent } from './new-user/new-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { NoAccessComponent } from './no-access/no-access.component';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';



@NgModule({
  declarations: [
    AppComponent,
    ReservationComponent,
    PageHeaderComponent,
    DropdownComponent,
    DropdownFilterComponent,
    NotFoundComponent,
    VypujckyComponent,
    PozadavkyComponent,
    LoginComponent,
    GameDetailsComponent,
    UserManagementComponent,
    NewUserComponent,
    EditUserComponent,
    NoAccessComponent,
    EditProfileComponent
  ],
  imports: [
    BrowserModule,
    LayoutModule,
    BrowserAnimationsModule,
    GridModule,
    IconsModule,
    LabelModule,
    DropDownsModule,
    HttpClientModule,
    RouterModule.forRoot([
      // { path: '', component: HomeComponent },
      { path: 'rezervace', component: ReservationComponent},
      { path: 'vypujcky', component: VypujckyComponent},
      { path: 'prehled_pozadavku', component: PozadavkyComponent},
      { path: 'sprava_uzivatelu', component: UserManagementComponent},
      { path: 'sprava_uzivatelu/novy_uzivatel', component: NewUserComponent},
      { path: 'sprava_uzivatelu/:id', component: EditUserComponent},
      { path: 'sprava_profilu', component: EditProfileComponent},
      { path: 'game', component: GameDetailsComponent},
      { path: '*', component: GameDetailsComponent},
      { path: '**', component: NotFoundComponent }
    ]),
    DialogsModule,
    DateInputsModule,
    NotificationModule,
    FormsModule,
    IndicatorsModule,
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'cs'
    },
    {
      provide: MessageService,
      useClass: CSLocaleMessageService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
