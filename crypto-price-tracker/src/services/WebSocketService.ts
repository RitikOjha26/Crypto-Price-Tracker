import type { Channel, WsOutboundMessage } from "../types";
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

type MessageHandler = (data: unknown) => void;

const RECONNECT_BASE_DELAY_MS = 1000;
const RECONNECT_MAX_DELAY_MS = 30000;
const RECONNECT_MAX_ATTEMPTS = 10;

export class WebSocketService {

    private ws: WebSocket | null = null;
    private url: string;
    private onStatusChange: (status: ConnectionStatus) => void;
    private handlers = new Set<MessageHandler>();
    private reconnectAttempts = 0;
    private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    private manuallyDisconnected = false;
    private messageQueue: WsOutboundMessage[] = [];

    constructor(
        url: string = `ws://${import.meta.env.VITE_WEB_SOCKET_URL}`,
        onStatusChange: (status: ConnectionStatus) => void = () => { },
    ) {
        this.url = url;
        this.onStatusChange = onStatusChange;
    }

    connect(): void {
        this.manuallyDisconnected = false;
        this.onStatusChange('connecting');
        const ws = new WebSocket(this.url);
        this.ws = ws

        ws.onopen = () => {
            if (this.ws !== ws) return; 
            this.reconnectAttempts = 0;
            this.onStatusChange('connected');
            this.messageQueue.forEach(msg => this.ws!.send(JSON.stringify(msg)));
            this.messageQueue = [];
        }


        ws.onclose = () => {
            if (this.ws != ws) return;
            this.ws = null;
            this.onStatusChange('disconnected');
            if (!this.manuallyDisconnected) this.scheduleReconnect();
        }


        ws.onerror = () => {
            if (this.ws === ws) this.onStatusChange('error');
        }

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data as string);
                this.handlers.forEach((h) => h(data));
            } catch (error) {
                console.error('Error parsing message', error);
            }

        }

    }

    scheduleReconnect(): void {

        if (this.reconnectAttempts >= RECONNECT_MAX_ATTEMPTS) {
            this.onStatusChange('disconnected')
            return;
        }
        this.reconnectAttempts++;
        this.onStatusChange('connecting');
        const delay = Math.min(
            RECONNECT_BASE_DELAY_MS * 2 ** this.reconnectAttempts, RECONNECT_MAX_DELAY_MS
        );

        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null
            this.connect();
        }, delay)
    }

    disconnect(): void {
        this.manuallyDisconnected = true;
        if (this.reconnectTimer !== null) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        const ws = this.ws;
        this.ws = null;
        ws?.close();
    }

    addmsgHandler(handler: MessageHandler): () => void {
        this.handlers.add(handler);
        return () => this.handlers.delete(handler);
    }

    //Pub Sub Events 

    subscribe(channel: Channel, symbol: string): void {
        this.send({ type: 'subscribe', payload: { channels: [{ name: channel, symbols: [symbol] }] } });
    }

    subscribeMany(channel: Channel, symbols: readonly string[]): void {
        this.send({ type: 'subscribe', payload: { channels: [{ name: channel, symbols: [...symbols] }] } });
    }

    // Send all channel+symbol pairs in one WS frame
    subscribeChannels(channels: Array<{ name: Channel; symbols: string[] }>): void {
        this.send({ type: 'subscribe', payload: { channels } });
    }

    unsubscribe(channel: Channel, symbol: string): void {
        this.send({ type: 'unsubscribe', payload: { channels: [{ name: channel, symbols: [symbol] }] } });
    }

    unsubscribeMany(channel: Channel, symbols: readonly string[]): void {
        this.send({ type: 'unsubscribe', payload: { channels: [{ name: channel, symbols: [...symbols] }] } });
    }

    // Send all channel+symbol unsubscribes in one WS frame
    unsubscribeChannels(channels: Array<{ name: Channel; symbols: string[] }>): void {
        this.send({ type: 'unsubscribe', payload: { channels } });
    }

    private send(msg: WsOutboundMessage) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(msg));
        }
        else {
            this.messageQueue.push(msg);
        }
    }

}