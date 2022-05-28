import {StyleSheet} from 'react-native';
import {black} from 'react-native-paper/lib/typescript/styles/colors';
import {theme} from '../../../../App.style';

export const adminZavadyStyle = StyleSheet.create({
  container: {
    backgroundColor: "#dfe7fd",
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,    
    borderRadius: 10,
  },
  containerTitle: {
    backgroundColor: '#BB86FC',
    paddingTop: 5,
    paddingBottom: 5,
    paddingHorizontal: 20,
    marginTop: 10,
    marginLeft: 3,
    marginRight: 3,
    borderColor: '#7161EF',
    borderWidth: 2,
    borderRadius: 10,
  },
  nazev: {
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'left',
  },

  typy: {
    color: '#000000',    
    textAlign: 'left',
  },
  
  stav: {
    color: 'green',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  zahlavi: {
    backgroundColor:'#BB86FC',
    position:"relative",
    paddingBottom:10,
    paddingTop:10,
    borderTopEndRadius: 100,
    borderBottomStartRadius: 100,
    
  },
  nadpis: {
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'center',    
  },

  fabka: {
    position: 'relative',    
    margin: 16,
    right: 0,
    bottom: 0,
    color: '#BB86FC',
    backgroundColor: '#BB86FC',
  },
  ikonka: {
    position: 'absolute',
    right: 10,
  },
  fotka: {
    flex: 100,
    width: 100,
    height: 100,
    resizeMode: 'cover',  
    margin: 10,
    borderRadius: 10,
  },

  tlacitko: {
    position: 'relative',
    left: 0,
    bottom: 0,
    marginTop: 10,
    marginLeft: 0,
    marginRight: 180,
    paddingLeft:2,
    paddingRight:2,
    color:"#cddafd"
    
  },

  filter: {
    position: 'relative',    
    marginTop: 10,
    marginLeft: 0,
    marginBottom:10,    
    paddingLeft:2,
    paddingRight:2,
    color:"#cddafd"
    
  },
  filter2: {
    position: 'absolute',   
    left:0,
    right:150,
    marginTop: 10,
    marginRight: 20,
    marginBottom:10,    
    paddingLeft:2,
    paddingRight:2,
    color:"#cddafd",
    display: 'flex',
    flex: 1,
    
  },
  filterInput: {
    position: 'relative',
    marginLeft:200,
    paddingLeft:0,
    paddingRight:0,
    marginTop: 0,
    marginRight: 0,
    marginBottom:0,
    display: 'flex',
    flex: 1,    
  },
  filterContainer: {
    position: 'relative',
    marginLeft:0,
    paddingLeft:2,
    paddingRight:2,
    marginBottom:40,
    marginTop:5,
    height:20
    
    
    
    
    
  },
  navVar: {
    position: 'relative',   
    marginTop:5,
    marginBottom:5
    
  },
  content: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: "white",
  },
  corner: {
    position:"absolute",
    right:0,
    bottom:0
  },
  corner2: {
    position:"absolute",
    left:0,
    bottom:0
    
  },
  popisek: {
    position:"relative",
    left:0,
    bottom:0,
    
  },
});
