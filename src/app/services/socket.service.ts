import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { bindCallback, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    constructor(private socket: Socket) { }

    fetchPlayers(): void {
        this.socket.emit('fetchMovies');
    }

    onFetchPlayers(): Observable<any> {
        return this.socket.fromEvent('fetchMovies');
    }

    emitControl(direction: any): void {
        this.socket.emit('controls', direction);
    }

    emitJoinGame(): void {
        this.socket.emit('join');
    }

    onTick(): Observable<any> {
        return this.socket.fromEvent('tick');
    }

    // onControls(): Observable<Array<any>> {
    //     return this.socket.fromEvent('controls');
    // }
}