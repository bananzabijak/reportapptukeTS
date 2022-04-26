import {StyleSheet} from 'react-native';
import {theme} from '../../../App.style';

export const editovatStyle = StyleSheet.create({
  popis: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    textShadowColor: '#FFFFFF',
    textDecorationColor: '#FFFFFF',
    activeOutlineColor: '#FFFFFF',
    color: 'white',
  },
  sekce: {
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'left',
    paddingTop: 10,
  },
  nazev: {
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'left',
    paddingTop: 10,
    fontSize: 18,
  },

  container: {
    backgroundColor: '#dfe7fd',
    paddingTop: 20,
    paddingBottom: 60,
    paddingHorizontal: 20,
    marginTop: 0,
    marginBottom: 0,    
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

  content: {
    padding: 15,
    paddingTop: 2,
  },

  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    color: theme.colors.primary,
  },
  zahlavi: {
    backgroundColor: '#BB86FC',
    position: 'relative',
    paddingBottom: 10,
    paddingTop: 10,
    borderTopEndRadius: 20,
    borderTopLeftRadius: 20,
  },
  nadpis: {
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  popisText: {
    color: '#FFFFFF',
  },

  buttonOdeslat: {
    position: 'relative',
    margin: 15,
    bottom: 0,
    paddingBottom: 10,
    paddingTop: 10,
  },

  listItem: {},

  selectButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: '#8ac6d1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: '#ffb6b9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    marginTop: 30,
    marginBottom: 50,
    alignItems: 'center',
  },
  progressBarContainer: {
    marginTop: 20,
  },
  imageBox: {
    width: 300,
    height: 300,
  },
});
