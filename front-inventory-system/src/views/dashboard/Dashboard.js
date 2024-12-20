import React, { useEffect, useState, useRef } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
  CButton,
  CButtonGroup,
  CTooltip,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'

const Dashboard = () => {
  const [items, setItems] = useState([])
  const wsRef = useRef(null)

  useEffect(() => {
    fetchItems()

    wsRef.current = new WebSocket('ws://127.0.0.1:8000/ws/items/')

    wsRef.current.onopen = () => {
      console.log('WebSocket connected')
    }

    wsRef.current.onmessage = (message) => {
      const data = JSON.parse(message.data)
      if (data.type === 'inventory_update') {
        const updatedItem = data.item
        setItems(prevItems => {
          const index = prevItems.findIndex(i => i.id === updatedItem.id)
          if (index === -1) {

            return [...prevItems, updatedItem]
          } else {

            const newItems = [...prevItems]
            newItems[index] = updatedItem
            return newItems
          }
        })
      }
    }

    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected')
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  const fetchItems = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/items/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      const data = await response.json()
      setItems(data)
    } catch (error) {
      console.error('Error fetching items:', error)
    }
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this item?')
    if (!confirmed) return
    try {
      await fetch(`http://127.0.0.1:8000/api/items/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      setItems(items.filter(item => item.id !== id))
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  const handleEdit = (id) => {
    console.log('Edit item:', id)

  }


  const groupedItems = items.reduce((acc, item) => {
    const level = item.reorder_level
    if (!acc[level]) {
      acc[level] = []
    }
    acc[level].push(item)
    return acc
  }, {})


  const levels = Object.keys(groupedItems).map(Number).sort((a, b) => a - b)

  return (
    <>
      {levels.map(level => (
        <CRow key={level}>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Level {level}</strong>
              </CCardHeader>
              <CCardBody>
                {groupedItems[level].length === 0 ? (
                  <p>No items for level {level}</p>
                ) : (
                  <CAccordion alwaysOpen>
                    {groupedItems[level].map(item => (
                      <CAccordionItem itemKey={item.id} key={item.id}>
                        <CAccordionHeader>
                          {item.name} (Qty: {item.quantity})
                        </CAccordionHeader>
                        <CAccordionBody>
                          <p><strong>Description:</strong> {item.description}</p>
                          <p><strong>Price:</strong> ${item.price}</p>
                          <p><strong>Reorder Level:</strong> {item.reorder_level}</p>
                          <CButtonGroup className="mt-3">
                            <CTooltip content="Edit Item">
                              <CButton color="warning" onClick={() => handleEdit(item.id)}>
                                <CIcon icon={cilPencil} />
                              </CButton>
                            </CTooltip>
                            <CTooltip content="Delete Item">
                              <CButton color="danger" onClick={() => handleDelete(item.id)}>
                                <CIcon icon={cilTrash} />
                              </CButton>
                            </CTooltip>
                          </CButtonGroup>
                        </CAccordionBody>
                      </CAccordionItem>
                    ))}
                  </CAccordion>
                )}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      ))}
    </>
  )
}

export default Dashboard
