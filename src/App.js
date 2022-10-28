import React from 'react';
import './App.css';
import { set_provider } from './Components/metmask';
import Panel from './Components/Panel';
import 'bootstrap/dist/css/bootstrap.min.css';
import { serviceCISI } from "./Components/serviceCISI";

let serviceCISIHandler = new serviceCISI();

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            balance: 0,
            accounts: [],
            conferencias: [],
            asistencia: [],
            customer: null,
            form_name: "",
            form_internal: false,
        };
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeInternal = this.handleChangeInternal.bind(this);
        this.handleChangeNameConferencia = this.handleChangeNameConferencia.bind(this);
        this.handleChangePrecioConferencia = this.handleChangePrecioConferencia.bind(this);
        this.registra = this.registra.bind(this);
        this.registraConferencia = this.registraConferencia.bind(this);
    }

    async get_conferencias_disponibles() {
        let conferencias = await serviceCISIHandler.get_conferences()
        this.setState({conferencias: conferencias});
    }

    async comprar_conferencia(i, conferencia) {
        await serviceCISIHandler.buyTicket(i, conferencia.price, this.state.accounts[0]);
        await this.leer_asistencia(this.state.accounts[0]);
    }

    async leer_asistencia(account) {
        let asistencia = await serviceCISIHandler.get_attendance(account);
        this.setState({asistencia: asistencia});
    }

    handleChangeName(event) {
        this.setState({form_name: event.target.value});
    }

    handleChangeInternal(event) {
        this.setState({form_internal: (this.state.form_internal ? false: true)});
    }

    handleChangeNameConferencia(event) {
        this.setState({form_name_conf: event.target.value});
    }

    handleChangePrecioConferencia(event) {
        this.setState({form_price_conf: event.target.value});
    }

    async registra(event) {
        await serviceCISIHandler.setCustomer(this.state.form_name, this.state.form_internal, this.state.accounts[0]);
    }

    async registraConferencia(event) {
        await serviceCISIHandler.add_conferences(this.state.form_name_conf, this.state.form_price_conf, this.state.accounts[0]);
        await this.get_conferencias_disponibles(this.state.accounts[0]);
    }

    async componentDidMount() {
        let accounts = await (await set_provider()).request({
            method:'eth_requestAccounts', 
        });
        this.setState({
            accounts: accounts,
        });

        await this.get_conferencias_disponibles(this.state.accounts[0]);
        await this.leer_asistencia(this.state.accounts[0]);

    }

    toEther(wei) {
        return wei * 0.000000000000000001;
    }

    render() {
        return (
            <React.Fragment>
                <div className="jumbotron">
                    <h4 className="display-4">Compra tus boletos para el CISI en BLOCKCHAIN!!!</h4>
                </div>

                <div className="row">
                    <div className="col-sm">
                        <Panel title="Registro">
                            <span><strong>{this.state.accounts[0]}</strong>: {this.state.balance}</span>
                            <div>
                                <div className="form-group">
                                    <label>Nombre</label>
                                    <input onChange={this.handleChangeName} type="text" className="form-control" id="nameInput" placeholder="Ingresa tu nombre completo"/>
                                </div>
                                <div className="form-check">
                                    <input type="checkbox" onChange={this.handleChangeInternal} className="form-check-input" id="exampleCheck1" />
                                    <label className="form-check-label" >Es Alumno / Empleado</label>
                                </div>
                                <button className="btn btn-primary" onClick={this.registra}>Submit</button>
                            </div>
                        </Panel>
                    </div>
                    <div className="col-sm">
                        <Panel title="Registra nueva conferencia">
                            <div>
                                <div className="form-group">
                                    <label>Nombre de la conferencia</label>
                                    <input onChange={this.handleChangeNameConferencia} type="text" className="form-control" id="nameInput" placeholder="Ingresa el nombre del evento"/>
                                </div>
                                <div className="form-group">
                                    <label>Precio</label>
                                    <input onChange={this.handleChangePrecioConferencia} type="text" className="form-control" id="nameInput" placeholder="Ingresa el precio del evento"/>
                                </div>
                                <button className="btn btn-primary" onClick={this.registraConferencia}>Submit</button>
                            </div>
                        </Panel>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm">
                        <Panel title="Tienda">
                            {this.state.conferencias.map((conferencia, i) => {
                                return <div key={i}>
                                    <span>{conferencia.date} - cost: {this.toEther(conferencia.price)}</span>
                                    <button className="btn btn-sm btn-success text-white" onClick={() => this.comprar_conferencia(i, conferencia)}>Comprar</button>
                                </div>
                            })}

                        </Panel>
                    </div>
                    <div className="col-sm">
                        <Panel title="Tus boletos">
                            {this.state.asistencia.map((flight, i) => {
                                return <div key={i}>
                                    {flight.date} - cost: {this.toEther(flight.price)} Ether
                                </div>
                            })}
                        </Panel>
                    </div>
                </div>
            </React.Fragment>
        )
    };
}

export default App;
