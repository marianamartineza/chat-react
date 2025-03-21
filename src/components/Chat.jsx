// Chat.js
import React, { useState, useEffect, useRef } from 'react';
import socket from '../config/socket';
import { CButton, CCard, CCardBody, CCardFooter, CCol, CContainer, CForm, CFormInput, CRow } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSend, cilUser } from '@coreui/icons';

function Chat() {
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [usernameSet, setUsernameSet] = useState(false);

  useEffect(() => {
    socket.connect();

    socket.on('chat message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.disconnect();
      socket.off('chat message');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username) {
      socket.emit('set username', username);
      setUsernameSet(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage) {
      socket.emit('chat message', newMessage);
      setNewMessage('');
    }
  };

  if (!usernameSet) {
    return (
      <CForm onSubmit={handleUsernameSubmit}>
        <CRow className='mt-3 px-2'>
          <CCol md={10} xs={10}>
            <CFormInput
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nombre de usuario"
            />
          </CCol>
          <CCol md={2} xs={2}>
            <CButton type="submit" color='primary'>
              <CIcon icon={cilUser} className='me-2'></CIcon>
              Ingresar
            </CButton>
          </CCol>
        </CRow>
      </CForm>
    );
  }

  return (
    <CContainer fluid>
      <CRow md={{cols:1, gutterY: 2}} style={{ maxHeight: '90%', overflowY: 'auto' }} className='mt-2 pt-10 px-2'>
        {messages.map((data, index) => (
            <CCard key={index} className='mb-2'>
              <CCardBody>
                {data.message}
              </CCardBody>
              <CCardFooter className='text-end'>
              {data.username}
              </CCardFooter>
            </CCard>
          ))}
          <hr ref={messagesEndRef} className='mb-2'/>
      </CRow>
        <CForm onSubmit={handleSubmit}>
          <CRow>
            <CCol md={10} xs={10}>
              <CFormInput
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
            </CCol>
            <CCol md={2} xs={2}>
              <CButton type="submit" color='primary'>
                <CIcon icon={cilSend} className='me-2'></CIcon>
                Enviar
              </CButton>
            </CCol>
          </CRow>
        </CForm>
    </CContainer>
  );
}

export default Chat;