import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { bindCallback, Observable, take } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    constructor(private socket: Socket) { }

    emitControl(direction: any): void {
        this.socket.emit('controls', direction);
    }

    emitJoinGame(): void {
        this.socket.emit('join');
    }

    onJoinGame(): Observable<any> {
        return this.socket.fromEvent('join');
    }

    onAddApple(): Observable<any> {
        return this.socket.fromEvent('addApple');
    }

    emitGetApples(): void {
        this.socket.emit('getApples');
    }

    emitGetSnakes(): void {
        this.socket.emit('getSnakes');
    }

    emitResetGame(): void {
        this.socket.emit('resetGame');
    }

    onResetGame(): Observable<any> {
        return this.socket.fromEvent('resetGame');
    }
    
    emitDisconnectGame(): void {
        this.socket.emit('disconnectGame');
    }

    onDisconnectGame(): Observable<any> {
        return this.socket.fromEvent('disconnectGame');
    }

    onGetApples(): Observable<any> {
        return this.socket.fromEvent('getApples').pipe(take(1));
    }

    onGetSnakes(): Observable<any> {
        return this.socket.fromEvent('getSnakes').pipe(take(1));
    }

    onRemoveApple(): Observable<any> {
        return this.socket.fromEvent('removeApple');
    }

    onTick(): Observable<any> {
        return this.socket.fromEvent('tick');
    }

    // onControls(): Observable<Array<any>> {
    //     return this.socket.fromEvent('controls');
    // }
}