import React from 'react';
import './SafeView.scss';
import {mdiGoogleDownasaur} from '@mdi/js';
import Icon from '@mdi/react';

/**
 * Nombre de proyecto: mfe-solicitudes-torrecontrol
 * Sistema: --
 * Cobranza y Crédito
 * Nombre: mfe-solicitudes-torrecontrol
 * Descripción: Componente Safe para mostrar
 * en lugar de un componente no cargado
 * Fecha de Modificación: 23/01/2023
 */
export default class SafeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isComponentLoaded: false,
    };
  }
  static getDerivedStateFromError(error) {
    return {
      isComponentLoaded: true,
    };
  }
  componentDidCatch() {}
  /**
   * Nombre de proyecto: mfe-solicitudes-torrecontrol
   * Sistema: --
   * Cobranza y Crédito
   * Nombre: mfe-solicitudes-torrecontrol
   * Descripción: Definicion del render
   * Fecha de Modificación: 23/01/2023
   */
  render() {
    if (this.state.isComponentLoaded) {
      const classes = ` mf-c-center ${this.props.border ? 'mf-bdr-grey-lighten-1' : ''}`;
      return (
        <div
          className={classes}
          style={{
            width: `${this.props.width}%`,
            height: `${this.props.height}%`,
            color: `${this.props.color ? this.props.color : '#757575'} `,
          }}
        >
          <Icon path={mdiGoogleDownasaur} size={this.props.iconSize} className='my-1' />
          <span className=''>{this.props.title}</span>
        </div>
      );
    }
    return <>{this.props.children}</>;
  }
}
const NUMBER_100 = 100;

/**
 * Nombre de proyecto: mfe-solicitudes-torrecontrol
 * Sistema: --
 * Cobranza y Crédito
 * Nombre: mfe-solicitudes-torrecontrol
 * Descripción: Propiedades de este componente
 * Fecha de Modificación: 23/01/2023
 */
SafeView.defaultProps = {
  height: NUMBER_100, //px
  width: NUMBER_100, //px
  title: '. . .',
  iconSize: 1,
  border: false,
  color: '',
};
