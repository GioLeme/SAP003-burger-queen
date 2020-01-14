import React, { Component } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import fire from 'firebase'
import moment from 'moment'
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuOption from '../menu/menu-option'
import Resume from '../resume/resume'

class MenuTabs extends Component {
  constructor(props) {
    super(props)
      this.state = {
        menu: {},
        activeIndex: 0,
        isLoading: true,
        selectedMenu:[],
      };
    this.menuOptions = this.menuOptions.bind(this);  
  }

  handleChange = (_, activeIndex) => this.setState({ activeIndex });

  getMenu () {
    return fire.firestore().collection('menu')
    .get()
    .then((snaps) => {
      const menuList = []
      snaps.forEach(doc => menuList.push(doc.data()))
      if(
        moment() >= moment(menuList[0].initiate_at, 'HH:mm') 
        && moment() <= moment(menuList[0].end_at, 'HH:mm') 
      ) {
        this.setState({ menu: menuList[0] })
      }
      else {
        this.setState({ menu: menuList[1]})
      }
      
    }) 
    .catch(err => err)
  }

  async componentDidMount(){
    await this.getMenu()
    this.menuOptions()
    this.setState({ isLoading: false })
  }

  filterLabels() {
    const menuLabel = Object.keys(this.state.menu);
    const filteredLabel = menuLabel.filter(label => label !== 'initiate_at' && label !== 'end_at')
    filteredLabel.push('Resumo')
    return filteredLabel
  }

  handleLabel() {
    return this.filterLabels().map((labelToRender, index ) => {
      return <MyTab label = {labelToRender} key={index} onClick={this.menuOptions} />
    })
  }

  menuOptions() {
    const filteredLabel = this.filterLabels()
    setTimeout(() => {
      this.setState({selectedMenu: []})
      const selectedMenu = this.state.menu[filteredLabel[this.state.activeIndex]]
      this.setState({selectedMenu})
    }, 200)
  }

  productsContainer() {
    const productsList = Object.values(this.state.selectedMenu)
    return productsList.map((actualProduct, index) => ( 
      
      <MenuOption 
        url_image={actualProduct.url_image} 
        name={actualProduct.name} 
        price={actualProduct.price} 
        key={index} 
        options={actualProduct.options.length > 0 ? actualProduct.options : null}
        extras={actualProduct.extras.length > 0 ? actualProduct.extras : null}
      />
    ))
  }
  
  render() {
    const { activeIndex, isLoading } = this.state;
      return (
        <>
          {isLoading ? <Load /> : 
            <div className='menu-container-father'>   
              <p className="menu-title">
                Menu
              </p>
              <div className='menu-container'>                   
                <div style={{backgroundColor: '#fff'}}>
                  <VerticalTabs value={activeIndex} onChange={this.handleChange} >
                    {this.handleLabel()}  
                  </VerticalTabs>
                </div >

                <div className="menu-list">
                  {
                    !this.state.selectedMenu 
                      ? <Resume /> 
                      : this.productsContainer()
                  }
                </div>
              </div>
            </div>
          
          }   
        </>
      );
  }
  
}

const VerticalTabs = withStyles(theme => ({
  //todos as tabs não clicadas
  flexContainer: {
    flexDirection: "column",
    
  },

  indicator: {
    display: "none"
  }
}))(Tabs);

const MyTab = withStyles(theme => ({
  //quadrado de fora todx
  root: {
    backgroundColor: "#e1e1e1",
    borderRight: '1px solid #737373',
    color: "white",   
  },
  //quadrado de dentro clicado
  wrapper: {
    backgroundColor: "#737373",
    padding: theme.spacing(2),
    width: '500px',
    height: '120px',
    color: '#fff',
    fontSize: '17px',

  },
  //quadrado de fora do clicado
  selected: {
    borderRight: "10px solid #34b6a6",
   

  }
}))(Tab);


const Load = withStyles(theme => ({
  root:{
    color: '#34b6a6'
    
  }
}))(CircularProgress)

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 24 }}>
      {props.children}
    </Typography>
  );
}

export default MenuTabs;
