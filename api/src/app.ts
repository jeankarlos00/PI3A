import express from 'express';
import bodyParser from 'body-parser';
import Routes from './interfaces/routes.interface';
 
class App {
  public app: express.Application;
  public port: number;
 
  constructor(port: number, routes: Routes[]) {
    this.app = express();
    this.port = port;
 
    this.initializeMiddlewares();
    this.initializeroutes(routes);
  }
 
  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.set('view engine', 'pug');
    this.app.set('views',  __dirname+'/../src/views');
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.static(__dirname+'/../src/views/styles'));
  }

 
  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
  private initializeroutes(routes: Routes[]) {
    routes.forEach((routes) => {
      this.app.use('/api/v1/', routes.router);
    });
  }
}
 
export default App;