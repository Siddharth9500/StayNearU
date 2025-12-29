import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Search from '../Pages/Search'
import PropertyDetails from '../Pages/PropertyDetails'
import AdminDashboard from '../Pages/AdminDashboard'
import AddProperty from '../Pages/AddProperty'
import EditProperty from '../Pages/editproperty'
import Wishlist from '../Pages/Wishlist'
import MapView from '../Pages/MapView'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/add-property" element={<AddProperty />} />
        <Route path="/edit-property/:id" element={<EditProperty />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/map" element={<MapView />} />
      </Routes>
    </Router>
  )
}
