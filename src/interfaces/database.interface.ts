export default interface DatabaseInterface {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
