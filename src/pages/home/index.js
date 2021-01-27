import React, {Component} from 'react';
import {connect} from 'react-redux';
import {MdAddShoppingCart} from 'react-icons/md';
import api from '../../services/api';
import { ProductList } from './styles';
import {formatPrice} from '../../util/format';
import {bindActionCreators} from 'redux';
import * as  CartActions from '../../store/modules/cart/actions';
 class Home extends Component {
  state = {
    products: [],
  };
  async componentDidMount(){
    const response = await api.get('products');
    const data = response.data.map(product =>({
      ...product,
      priceFormatted: formatPrice(product.price)
    }))
    this.setState({products: data})
  }
  handleAddProduct = product =>{
    const {AddToCart} = this.props;
    AddToCart(product);
  }
  render(){
    const {products} = this.state;
    const {amount } = this.props;
    return(
      <ProductList>
        {products.map(product => (
                  <li key={product.id}>
                  <img src={product.image}
                  alt={product.title}
                  />
                  <strong>{product.title}</strong>
                  <span>{product.priceFormatted}</span>
                  <button type="button" onClick ={() => this.handleAddProduct(product)}>
                      <div>
                        <MdAddShoppingCart size={16} color="#FFF"/> {amount[product.id||0]}
                      </div>
                      <span>Adicionar ao carrinho</span>
                  </button>
                </li>
        ))}

      </ProductList>
    );
  }
}
const mapStateToProps = state => ({
  amount: state.cart.reduce((amount, product) =>{
    amount[product.id] = product.amount;
    return amount;
  }, {}),
});
const mapDispatchToProps = dispatch => bindActionCreators(CartActions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Home)