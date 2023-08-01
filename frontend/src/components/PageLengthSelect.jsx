import React from 'react'
import Label from './Label'

export default function PageLengthSelect({ id, value, onChange }) {
  return (
    <div className="my-2 align-self-center">
      <Label text="Broj redaka po stranici" />
      <select id={id} name={id} onChange={onChange} value={value} className="form-select">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
      </select>
    </div>
  )
}
