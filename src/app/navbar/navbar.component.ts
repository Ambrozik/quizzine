import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UsersService} from "../shared/services/users.service";
import {User} from "../shared/types/user.type";
import {HandlerLoginType} from "../shared/types/handlerLogin-type";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DialogComponent} from "../shared/dialog/dialog.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DialogLoginComponent} from "../dialog-login/dialog-login.component";
import {filter, map, mergeMap} from "rxjs/operators";
import {Observable} from "rxjs";
import {AuthService} from "../shared/services/auth.service";
import {HttpEvent} from "@angular/common/http";
import {LoginResponse} from "../shared/types/login-response.interface";
import {UserComponent} from "../user/user.component";

@Component({
  selector: 'quizzine-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private _handlerLogin: HandlerLoginType[];
  private _submit$: EventEmitter<User>;
  private readonly _form: FormGroup;
  private _dialogStatus: string;
  private _userDialog: MatDialogRef<DialogLoginComponent, HandlerLoginType> | undefined;
  _user: User;
  private _isUpdateMode : boolean;



  constructor(private _authService: AuthService, private _dialog: MatDialog, private _userService: UsersService) {
    this._isUpdateMode = false;
    this._submit$ = new EventEmitter<User>();
    this._handlerLogin = [];
    this._form = this._buildForm();
    this._dialogStatus = 'inactive';
    this._user = {} as User;
  }

  get isUpdateMode(): boolean{
    return this._isUpdateMode;
  }

  ngOnInit(): void {
  }

  ngOnChanges(record: any): void{
    if (record.model && record.model.currentValue) {
      this._user = record.model.currentValue;
      this._isUpdateMode = true;
    } else {
      this._user = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        isAdmin: false
      };
      this._isUpdateMode = false;
    }

    // update form's values with model
    this._form.patchValue(this._user);
  }

  get form(): FormGroup {
    return this._form;
  }

  get appName(): string {
    return "Quizzine";
  }

  /**
   * Returns private property _submit$
   */
  @Output('submit')
  get submit$(): EventEmitter<User> {
    return this._submit$;
  }

  submit(user: User): void {
    this._submit$.emit(user);

  }

  private _buildForm(): FormGroup {
    return new FormGroup({
      username: new FormControl('', Validators.compose([Validators.required, Validators.minLength(2)])),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(2)])),
    })
  }

  /**
   * Function to display modal
   */
  showDialog(): void {
    // set dialog status
    this._dialogStatus = 'active';

    // open modal
    this._userDialog = this._dialog.open(DialogLoginComponent, {
      width: '500px',
      disableClose: true
    });

    this._userDialog.afterClosed()
      .pipe(
        filter( (user: HandlerLoginType|undefined) => !!user),
    map((user: HandlerLoginType|undefined) => {
      return user;
    }),
      mergeMap((handlerLogin: HandlerLoginType|undefined) => this._login(handlerLogin?.username, handlerLogin?.password))
    ).subscribe( {
      next: (token: LoginResponse ) => {
        window.sessionStorage.setItem('auth-token', token.access_token);
        window.sessionStorage.setItem('userId', token.userId);
      },
      error: () => this._dialogStatus = 'inactive',
      complete: () => this._dialogStatus = 'inactive'
    });

  }

  public isLogin():boolean{
    return !!window.sessionStorage.getItem('userId');
  }

  public deconnexion():void{
    window.sessionStorage.removeItem('auth-token');
    window.sessionStorage.removeItem('userId');
  }

  private _login(username: string | undefined, password: string | undefined): Observable<LoginResponse> {
        return this._authService.login(username, password);
    }
}
