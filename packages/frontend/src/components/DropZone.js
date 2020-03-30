import React, { useCallback } from 'react';
import {useDropzone} from 'react-dropzone';
import styled, { css } from 'styled-components';

export const MyDropZone = styled.div`
  opacity: 0.8;
  background-color: #c5c5c5;
  border-radius: 4px;
  display: flex;
  height: 100%;
  justify-content: center;
  align-content: center;
  padding-bottom: 15px;
  span {
    display: inline-block;
    opacity: 1 !important;
    color: #fff;
    padding: 12px;
    text-align: center;
    align-self: center;
    font-size: 2.5em;
  }

  :hover  {
    opacity: ${props => (props.file !== undefined) ? 0.7 : 0.2 };;
    background-color: #5F9EA0;
  }

  ${props =>
    (props.file !== undefined) &&
    css`
      cursor: not-allowed;
      opacity: 0.7;
      background-color: #5F9EA0 !important;
      span {
        opacity: 1 !important;
        color: #fff;
      }
      
    `}
`

// import { Container } from './styles';

export default function DropZone({file, handleFile, ...props}) {
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    handleFile(acceptedFiles);
  }, [handleFile])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <MyDropZone file={file} { ...getRootProps()}>
      <input {...getInputProps()} />
      {
        (file !== undefined) ? <span>Arquivo carregado</span> :
        isDragActive ?
          <span>Solte o arquivo ...</span> :
          (<span>Arraste o arquivo...<br/>ou clique para selecionar...
          </span>)
      }
    </MyDropZone>
  )
}