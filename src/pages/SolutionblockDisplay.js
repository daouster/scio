import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '../components/supabase.js'
import {
  Container,
  Section,
  Title,
  TextArea,
  StyledButton,
  TitleblockButtons,
} from './TitleBlockPage.js'
import CustomSnackbar from '../components/CustomSnackbar.js'

import { v4 as uuidv4 } from 'uuid';
import {  Button, Grid, Card, CardMedia, CardContent, Box } from '@mui/material';

const CDNURL = "https://vrkrxuzxtdbtcwyhcaiq.supabase.co/storage/v1/object/public/images/scio/solution/";



const SolutionblockDisplay = ({ selectedEntryId, selectedId, onClose }) => {
  const [solutionblock, setSolutionblock] = useState({})
  const customSnackbarRef = useRef(null)

  useEffect(() => {
    fetchSolutionblock()
  }, [])

  async function fetchSolutionblock() {
    try {
      const { data, error } = await supabase
        .from('Solutioncontent_duplicate')
        .select('*')
        .eq('ID', selectedEntryId)
        .single()

      if (error) {
        throw error
      }

      if (data) {
        setSolutionblock(data)
      } else {
        setSolutionblock({})
      }
    } catch (error) {
      console.error('Error fetching Solution block:', error.message)
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setSolutionblock((prevImplementationblock) => ({
      ...prevImplementationblock,
      [name]: value,
    }))
  }

  const dataToSubmit = {
    ...solutionblock,
    id: selectedId,
    ID: selectedEntryId,
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      let { data, error } = {}
      // Check if implementation block ID exists
      const existingEntry = await supabase
        .from('Solutioncontent_duplicate')
        .select('*')
        .eq('ID', solutionblock.ID)
        .single()

      if (!existingEntry.data) {
        // Insert a new entry if it doesn't exist
        ;({ data, error } = await supabase
          .from('Solutioncontent_duplicate')
          .insert([dataToSubmit]))
      } else {
        // Update existing entry
        ;({ data, error } = await supabase
          .from('Solutioncontent_duplicate')
          .update(solutionblock)
          .eq('ID', solutionblock.ID))
      }

      if (error) {
        throw error
      }

      fetchSolutionblock()
      customSnackbarRef.current.showSnackbar(
        'Successfully saved Solution form.',
        'success',
      )
    } catch (error) {
      customSnackbarRef.current.showSnackbar(`Error: ${error.message}`, 'error')
      console.error('Error saving Solution form:', error.message)
    }
  }

 
  /* Upload Image*/
  const [images, setImages] = useState([]);
  
  const [selectedFile, setSelectedFile] = useState(null);

  async function getImages() {
    const { data, error } = await supabase
    
      .storage
      .from('images')
      .list( 'scio/solution/', {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc"}
      });   

      if(data !== null) {
        setImages(data);
      } else {
        alert("Error loading images");
        console.log(error);
      }
  }

  useEffect(() => {
    getImages();    
}, [])


async function uploadImage(e) {

  let file = e.target.files[0];  

  const { data, error } = await supabase
    .storage
    .from('images/scio/solution/')
    .upload('/' + uuidv4(), file )
     
    if(data) {
      console.log('Image uploaded successfully')
    getImages();
  } else {
    console.log('Error uploading image:', error)
  }
}


async function deleteImage(imageName) {
  const { error } = await supabase
    .storage
    .from('images')
    .remove([ 'scio/solution/' + imageName])
  
  if(error) {
    alert(error);
  } else {
    getImages();
  }
}

const handleImageClick = () => {
  if (selectedFile)
  {
    window.open(URL.createObjectURL(selectedFile)); 
};
}



  return (
    <form onSubmit={handleSubmit}>
      <Container>
        <Section>
          <Title>Model Diagram Graphic</Title>
          <p>Use the Choose File button below to upload an image to your gallery</p>
          <input type="file" accept=".png, .jpg, .jpeg, " onChange={(e) => uploadImage(e)} />
          <hr />
          <h3>Your Images</h3>
          <Grid container spacing={2}>
            {images.map((image) => (
              <Grid item key={CDNURL + "/" + image.name}>
                <Card>
                  <CardMedia  
                    component="img"
                    height="150"                
                    image={CDNURL + "/" + image.name}
                  />
                  <CardContent>   
                   
                   <Button size="small" variant="contained" color="error" onClick={() => deleteImage(image.name)}>Delete Image</Button> 
                   
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>  
          <Title>Alternative vs. Objectives Table</Title>
          <p>Use the Choose File button below to upload an image to your gallery</p>
          <input type="file" accept=".png, .jpg, .jpeg, " onChange={(e) => uploadImage(e)} />
          <hr />
          <h3>Your Files</h3>
          <Grid container spacing={2}>
            {images.map((image) => (
              <Grid item key={CDNURL + "/" + image.name}>
                <Card>
                  <CardMedia  
                    component="img"
                    height="150"                
                    image={CDNURL + "/" + image.name}
                  />
                  <CardContent>   
                   
                   <Button size="small" variant="contained" color="error" onClick={() => deleteImage(image.name)}>Delete Image</Button> 
                   
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>  
          <Title>Indicated Recommended and Selected Solution</Title>
          <TextArea placeholder='' />
          <Title>Model Diagram Graphic</Title>
          <p>Use the Choose File button below to upload an image to your gallery</p>
          <input type="file" accept=".png, .jpg, .jpeg, " onChange={(e) => uploadImage(e)} />
          <hr />
          <h3>Your Images</h3>
          <Grid container spacing={2}>
            {images.map((image) => (
              <Grid item key={CDNURL + "/" + image.name}>
                <Card>
                  <CardMedia  
                    component="img"
                    height="150"                
                    image={CDNURL + "/" + image.name}
                  />
                  <CardContent>   
                   
                   <Button size="small" variant="contained" color="error" onClick={() => deleteImage(image.name)}>Delete Image</Button> 
                   
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>  
        </Section>

        <Section>
          <Title>Identify several compelling creative alternatives</Title>
          <TextArea
            placeholder=''
            name='SEQ1'
            required={false}
            onChange={handleChange}
            value={solutionblock.SEQ1 || ''}
          />
          <Title>
            What model type is best suited for right level of evaluation rigour
            and complexity?
          </Title>
          <TextArea
            placeholder=''
            name='SEQ2'
            required={false}
            onChange={handleChange}
            value={solutionblock.SEQ2 || ''}
          />
          <Title>
            What inputs are influential variables? Technical, people, management
            system?
          </Title>
          <TextArea
            placeholder=''
            name='SEQ3'
            required={false}
            onChange={handleChange}
            value={solutionblock.SEQ3 || ''}
          />
          <Title>
            What are the best knowledge sources: intuition/experience,
            data/analytics evidence or a mix? How do we trust human judgement vs
            ML/AI?
          </Title>
          <TextArea
            placeholder=''
            name='SEQ4'
            required={false}
            onChange={handleChange}
            value={solutionblock.SEQ4 || ''}
          />
          <Title>
            What is our uncertainty? What is our value of Information? Is it
            worth seeking more knowledge to reduce our uncertainty?
          </Title>
          <TextArea
            placeholder=''
            name='SEQ5'
            required={false}
            onChange={handleChange}
            value={solutionblock.SEQ5 || ''}
          />
          <Title>Have we guarded against all relevant biases?</Title>
          <TextArea
            placeholder=''
            name='SEQ6'
            required={false}
            onChange={handleChange}
            value={solutionblock.SEQ6 || ''}
          />
          <Title>
            Do constraints come into play? If so, what value is left on table?
            Is that acceptable?
          </Title>
          <TextArea
            placeholder=''
            name='SEQ7'
            required={false}
            onChange={handleChange}
            value={solutionblock.SEQ7 || ''}
          />
        </Section>
      </Container>
      <TitleblockButtons>
        <StyledButton type='submit'>Save</StyledButton>
        <StyledButton onClick={onClose}>Close</StyledButton>
      </TitleblockButtons>
      <CustomSnackbar ref={customSnackbarRef} />
    </form>
  )
}

export default SolutionblockDisplay
