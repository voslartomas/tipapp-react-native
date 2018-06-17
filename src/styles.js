import { Platform } from 'react-native';

const primaryColor = '#202020';
const secondaryColor = '#f3d827';

export default {
  primary: primaryColor,
  secondary: secondaryColor,
  danger: '#ff2233',
  notice: '#3999CC',
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#202020',
  },
  containerTop: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#202020',
  },
  containerNoFlex: {
    backgroundColor: '#202020',
  },
  error: {
    color: '#ff2233',
    textAlign: 'center'
  },
  logo: {
    color: '#f3d827',
    textAlign: 'center',
    fontSize: 40
  },
  textCenter: {
    textAlign: 'center',
    color: '#333333',
    margin: 20,
  },
  input: {
    margin: 15,
    height: 40,
    borderColor: secondaryColor,
    borderBottomWidth: 1,
    backgroundColor: primaryColor,
    color: 'white'
  },
  headerBar: {
    backgroundColor: '#202020',
    borderWidth: 1,
    borderBottomColor: '#f3d827'
  },
  button: {
    color: 'black',
    textAlign: 'center',
    backgroundColor: 'white',
    padding: 10,
    margin: 15,
  },
  buttonLink: {
    backgroundColor: primaryColor,
    color: 'white'
  },
  header: { color: secondaryColor, fontSize: 32, textAlign: 'center', fontWeight: 'bold' },
  subHeader: { color: secondaryColor, fontSize: 16, textAlign: 'center', fontWeight: 'bold' },
  bigHeader: { fontSize: 40, textAlign: 'center', fontWeight: 'bold' },
  normalText: { fontSize: 18, color: 'white', textAlign: 'center', fontWeight: 'bold' },
  smallText: { fontSize: 14, color: 'white', textAlign: 'center', fontWeight: 'bold' },
};
