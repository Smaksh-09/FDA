"use client"

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Clock, X, Image } from 'lucide-react'
import RestaurantSidebar from '../../components/ui/RestaurantSidebar'
import { dummyRestaurant } from '../dummyData'
import { MenuItem } from '../types'

interface MenuItemModalProps {
  item: MenuItem | null
  isOpen: boolean
  onClose: () => void
  onSave: (item: MenuItem) => void
  isNewItem: boolean
}

function MenuItemModal({ item, isOpen, onClose, onSave, isNewItem }: MenuItemModalProps) {
  const [formData, setFormData] = useState<Partial<MenuItem>>(
    item || {
      name: '',
      description: '',
      price: 0,
      category: 'Burgers',
      isAvailable: true,
      preparationTime: 5,
      ingredients: []
    }
  )

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newItem: Partial<MenuItem> = {
      id: item?.id || undefined,
      name: formData.name!,
      description: formData.description!,
      price: formData.price!,
      category: formData.category!,
      isAvailable: formData.isAvailable!,
      preparationTime: formData.preparationTime!,
      ingredients: formData.ingredients || [],
      imageUrl: (formData as any).imageUrl || undefined,
    }
    onSave(newItem as MenuItem)
  }

  const categories = ['Burgers', 'Appetizers', 'Sides', 'Wraps', 'Beverages', 'Salads', 'Desserts']

  return (
    <div className="fixed inset-0 backdrop-blur-md   bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-sm border-2 border-black p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto neobrutalist-shadow">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black">
            {isNewItem ? 'ADD NEW MENU ITEM' : 'EDIT MENU ITEM'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-black" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Item Name
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border-2 border-black bg-white text-black font-normal focus:outline-none focus:border-[#39FF14] transition-colors"
              placeholder="e.g., Classic Cheeseburger"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border-2 border-black bg-white text-black font-normal focus:outline-none focus:border-[#39FF14] transition-colors h-20 resize-none"
              placeholder="Describe the item..."
              required
            />
          </div>

          {/* Price, Category and Image URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border-2 border-black bg-white text-black font-normal focus:outline-none focus:border-[#39FF14] transition-colors"
                placeholder="0"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Category
              </label>
              <select
                value={formData.category || 'Burgers'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border-2 border-black bg-white text-black font-normal focus:outline-none focus:border-[#39FF14] transition-colors"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-black mb-2">
                Image URL (optional)
              </label>
              <input
                type="url"
                value={(formData as any).imageUrl || ''}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value as any })}
                className="w-full px-3 py-2 border-2 border-black bg-white text-black font-normal focus:outline-none focus:border-[#39FF14] transition-colors"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Preparation Time and Availability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Preparation Time (minutes)
              </label>
              <input
                type="number"
                value={formData.preparationTime || ''}
                onChange={(e) => setFormData({ ...formData, preparationTime: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border-2 border-black bg-white text-black font-normal focus:outline-none focus:border-[#39FF14] transition-colors"
                placeholder="5"
                min="1"
                required
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isAvailable || false}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="w-4 h-4 border-2 border-black focus:outline-none focus:ring-0"
                />
                <span className="font-bold text-black text-sm">Available for orders</span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t-2 border-black">
            <button
              type="submit"
              className="px-6 py-3 bg-[#39FF14] border-2 border-black text-black font-bold hover:neobrutalist-shadow transition-all"
            >
              [{isNewItem ? 'ADD ITEM' : 'SAVE CHANGES'}]
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white border-2 border-black text-black font-bold hover:bg-gray-50 transition-colors"
            >
              [CANCEL]
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isNewItem, setIsNewItem] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const categories = ['All', 'Burgers', 'Appetizers', 'Sides', 'Wraps', 'Beverages', 'Salads', 'Desserts']

  const fetchItems = async () => {
    const res = await fetch('/api/food-items', { credentials: 'include' })
    if (res.ok) {
      const data = await res.json()
      setMenuItems(data)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleToggleAvailability = async (itemId: string) => {
    const item = menuItems.find(i => i.id === itemId)
    if (!item) return
    const res = await fetch(`/api/food-items/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ isAvailable: !item.isAvailable })
    })
    if (res.ok) {
      fetchItems()
    }
  }

  const handleAddNew = () => {
    setSelectedItem(null)
    setIsNewItem(true)
    setIsModalOpen(true)
  }

  const handleEdit = (item: MenuItem) => {
    setSelectedItem(item)
    setIsNewItem(false)
    setIsModalOpen(true)
  }

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return
    const res = await fetch(`/api/food-items/${itemId}`, { method: 'DELETE', credentials: 'include' })
    if (res.ok) {
      fetchItems()
    }
  }

  const handleSave = async (item: MenuItem) => {
    if (isNewItem) {
      const res = await fetch('/api/food-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: item.name,
          description: item.description,
          price: item.price,
          imageUrl: (item as any).imageUrl,
          isAvailable: item.isAvailable,
        })
      })
      if (res.ok) {
        setIsModalOpen(false)
        fetchItems()
      }
    } else {
      const res = await fetch(`/api/food-items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: item.name,
          description: item.description,
          price: item.price,
          isAvailable: item.isAvailable,
        })
      })
      if (res.ok) {
        setIsModalOpen(false)
        fetchItems()
      }
    }
  }


  const filteredItems = menuItems.filter(item => 
    selectedCategory === 'All' || item.category === selectedCategory
  )

  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN')}`
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* Sidebar */}
      <RestaurantSidebar 
        restaurant={dummyRestaurant} 
        currentPage="menu" 
      />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-black text-black mb-2">
              MENU ITEMS
            </h1>
            <p className="text-gray-600 font-normal">
              Manage your restaurant's menu • {menuItems.length} total items
            </p>
          </div>
          
          <button
            onClick={handleAddNew}
            className="px-6 py-3 bg-[#39FF14] border-2 border-black text-black font-bold hover:neobrutalist-shadow-active active:translate-x-1 active:translate-y-1 transition-all duration-100 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            [+ ADD NEW MENU ITEM]
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 border-2 border-black font-bold text-sm transition-all ${
                  selectedCategory === category
                    ? 'bg-[#39FF14] text-black neobrutalist-shadow'
                    : 'bg-white text-black hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Table */}
        <div className="bg-white border-2 border-black neobrutalist-shadow">
          {/* Table Header */}
          <div className="grid grid-cols-7 gap-4 p-4 border-b-2 border-black bg-[#F5F5F5] font-bold text-black text-sm">
            <div>ITEM NAME</div>
            <div>PRICE</div>
            <div>DESCRIPTION</div>
            <div>PREP TIME</div>
            <div>CATEGORY</div>
            <div>AVAILABILITY</div>
            <div>ACTIONS</div>
          </div>

          {/* Items List */}
          <div className="divide-y-2 divide-black">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-600 font-normal text-lg">
                  {selectedCategory === 'All' ? 'No menu items found' : `No items in ${selectedCategory} category`}
                </p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div key={item.id} className="grid grid-cols-7 gap-4 p-4 hover:bg-gray-50 transition-colors">
                  {/* Item Name */}
                  <div>
                    <div className="font-bold text-black">{item.name}</div>
                    <div className="text-xs text-gray-600">
                      ID: {item.id}
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <div className="font-bold text-black text-lg">
                      {formatCurrency(item.price)}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <p className="font-normal text-black text-sm leading-tight line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Prep Time */}
                  <div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span className="font-normal text-black">{item.preparationTime} min</span>
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <span className="px-2 py-1 bg-gray-100 border border-black text-black font-bold text-xs">
                      {item.category}
                    </span>
                  </div>

                  {/* Availability Toggle */}
                  <div>
                    <button
                      onClick={() => handleToggleAvailability(item.id)}
                      className={`w-12 h-6 border-2 border-black transition-all ${
                        item.isAvailable 
                          ? 'bg-[#39FF14]' 
                          : 'bg-white'
                      }`}
                      title={item.isAvailable ? 'Available - Click to disable' : 'Unavailable - Click to enable'}
                    >
                      <div className={`w-4 h-4 backdrop-blur-md transition-transform ${
                        item.isAvailable ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                    <div className="text-xs text-gray-600 mt-1">
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 bg-white border-2 border-black text-black hover:bg-[#39FF14] transition-colors"
                        title="Edit Item"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 bg-white border-2 border-black text-black hover:bg-red-500 hover:text-white transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border-2 border-black p-4">
            <div className="font-bold text-black text-2xl">{menuItems.length}</div>
            <div className="text-gray-600 font-normal text-sm">Total Items</div>
          </div>
          <div className="bg-white border-2 border-black p-4">
            <div className="font-bold text-black text-2xl">
              {menuItems.filter(item => item.isAvailable).length}
            </div>
            <div className="text-gray-600 font-normal text-sm">Available</div>
          </div>
          <div className="bg-white border-2 border-black p-4">
            <div className="font-bold text-black text-2xl">
              {menuItems.filter(item => !item.isAvailable).length}
            </div>
            <div className="text-gray-600 font-normal text-sm">Unavailable</div>
          </div>
          <div className="bg-white border-2 border-black p-4">
            <div className="font-bold text-black text-2xl">
              {formatCurrency(Math.round(menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length))}
            </div>
            <div className="text-gray-600 font-normal text-sm">Avg Price</div>
          </div>
        </div>
      </div>

      {/* Item Modal */}
      <MenuItemModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        isNewItem={isNewItem}
      />
    </div>
  )
}
