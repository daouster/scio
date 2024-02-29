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

import { v4 as uuidv4 } from 'uuid'
import { Button, Grid, Card, CardMedia, CardContent } from '@mui/material'

const CDNURL = process.env.REACT_APP_CDN_URL

const DecisionBlockPage = ({ generatedId, providedId, setNextPage }) => {
  const customSnackbarRef = useRef(null)
  const [decisionblocks, setDecisionblocks] = useState([])
  const [decisionblock, setDecisionblock] = useState({})

  const handleNextClick = () => {
    setNextPage()
  }

  useEffect(() => {
    fetchDecisionblocks()
  }, [])

  async function fetchDecisionblocks() {
    const { data } = await supabase
      .from('Decisioncontent_duplicate')
      .select('*')
    setDecisionblocks(data)
  }

  function handleChange(event) {
    setDecisionblock((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      }
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const dataToSubmit = {
        ...decisionblock,
        id: generatedId,
        ID: providedId,
      }

      const { data, error } = await supabase
        .from('Decisioncontent_duplicate')
        .insert([dataToSubmit])
      if (error) {
        throw error
      }
      fetchDecisionblocks()
      customSnackbarRef.current.showSnackbar(
        'You have successfully saved this Decision form',
        'success',
      )
    } catch (error) {
      customSnackbarRef.current.showSnackbar(error.message, 'error')
      console.error('Error saving Decision form:', error.message)
    }
  }

  /* Upload Image1*/

  const [images1, setImages1] = useState([])



  async function getImages1() {
    const { data, error } = await supabase.storage
      .from('images')
      .list('scio/' + providedId + '/decision' + '/file1', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      })

    if (data !== null) {
      setImages1(data)
    } else {
      alert('Error loading images')
      console.log(error)
    }
  }

  useEffect(() => {
    getImages1()
  }, [])

  async function uploadImage1(e) {
    let file = e.target.files[0]

    const { data, error } = await supabase.storage
      .from('images/scio/' + providedId + '/decision' + '/file1')
      .upload('/' + uuidv4(), file)

    if (data) {
      console.log('Image uploaded successfully')
      getImages1()
    } else {
      console.log('Error uploading image:', error)
    }
  }

  async function deleteImage1(imageName) {
    const { error } = await supabase.storage
      .from('images')
      .remove(['scio/' + providedId + '/decision' +'/file1' + '/' + imageName])

    if (error) {
      alert(error)
    } else {
      getImages1()
    }
  }

/* Upload Image2*/

const [images2, setImages2] = useState([])

const [selectedFile, setSelectedFile] = useState(null)

async function getImages2() {
  const { data, error } = await supabase.storage
    .from('images')
    .list('scio/' + providedId + '/decision' + '/file2', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    })

  if (data !== null) {
    setImages2(data)
  } else {
    alert('Error loading images')
    console.log(error)
  }
}

useEffect(() => {
  getImages2()
}, [])

async function uploadImage2(e) {
  let file = e.target.files[0]

  const { data, error } = await supabase.storage
    .from('images/scio/' + providedId + '/decision' + '/file2')
    .upload('/' + uuidv4(), file)

  if (data) {
    console.log('Image uploaded successfully')
    getImages2()
  } else {
    console.log('Error uploading image:', error)
  }
}

async function deleteImage2(imageName) {
  const { error } = await supabase.storage
    .from('images')
    .remove(['scio/' + providedId + '/decision' + '/file2' + '/' + imageName])

  if (error) {
    alert(error)
  } else {
    getImages2()
  }
}


  const handleImageClick = () => {
    if (selectedFile) {
      window.open(URL.createObjectURL(selectedFile))
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Container>
        <Section>
          <Title>Decision Statement</Title>
          <p>
            Present a summary of the final decision, the factors that influenced
            this choice, and why this alternative was chosen over others
            rejected.
          </p>
          <TextArea
            placeholder=''
            name='DS1'
            required={false}
            onChange={handleChange}
          />

          <Title>Secondary The Decision Content:</Title>
          <Title>Strategy & Values Alignment Table</Title>
          <p>
            Use the Choose File button below to upload an image to your gallery
          </p>
          <input
            type='file'
            accept='.png, .jpg, .jpeg, '
            onChange={(e) => uploadImage1(e)}
          />
          <hr />
          <h3>Your Images</h3>
          <Grid container spacing={2}>
            {images1.map((image) => (
              <Grid
                item
                key={CDNURL + providedId +  '/decision' + '/file1' + '/' + image.name}
              >
                <Card>
                  <CardMedia
                    component='img'
                    height='150'
                    image={
                      CDNURL + providedId +  '/decision' + '/file1' + '/' + image.name
                    }
                  />
                  <CardContent>
                    <Button
                      size='small'
                      variant='contained'
                      color='error'
                      onClick={() => deleteImage1(image.name)}
                    >
                      Delete Image
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Title>Effort vs Success Table (optional)</Title>
          <p>
            Use the Choose File button below to upload an image to your gallery
          </p>
          <input
            type='file'
            accept='.png, .jpg, .jpeg, '
            onChange={(e) => uploadImage2(e)}
          />
          <hr />
          <h3>Your Images</h3>
          <Grid container spacing={2}>
            {images2.map((image) => (
              <Grid
                item
                key={CDNURL + providedId +  '/decision' + '/file2' +  '/' + image.name}
              >
                <Card>
                  <CardMedia
                    component='img'
                    height='150'
                    image={
                      CDNURL + providedId +  '/decision' + '/file2' +  '/'  + image.name
                    }
                  />
                  <CardContent>
                    <Button
                      size='small'
                      variant='contained'
                      color='error'
                      onClick={() => deleteImage2(image.name)}
                    >
                      Delete Image
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Section>
        <Section>
          <Title>WYSIATI:</Title>
          <p>
            What you see is all there is. Is there any relevant considerations
            outside the presented problem-solving set that needs to be part of
            the decision? Did the team miss or misrepresent something important?
            Is more work is required in the problem-solution set?Valid reasons
            include: improper framing, lack of creative alternatives, irrelevant
            or unreliable information and knowledge sources, improper tradeoff
            evaluation, unsuitable modeling, logic or reasoning errors.
            Goal-seeking bias for a preferred recommendation is not a valid
            reason.
          </p>
          <TextArea
            placeholder=''
            name='DQ1'
            required={false}
            onChange={handleChange}
          />
          <Title>Collaboration:</Title>
          <p>
            Has there been effective dialogue between problem-solvers, those
            providing input and consulted, stakeholders, and the decision-maker?
            Has everyone weighed in or agreed who should? Has the best available
            information and knowledge been evaluated with sufficient confidence
            to proceed?
          </p>
          <TextArea
            placeholder=''
            name='DQ2'
            required={false}
            onChange={handleChange}
          />
          <Title>Yeah… But:</Title>
          <p>
            Is there a "Yeah, but…" reaction? If yes, misaligned motivation can
            adversely affect decision-making. Can the conflict cause be
            identified and resolved instead of avoiding the decision? What's
            best for the organization and its stated goals, strategies,
            objectives and values?
          </p>
          <TextArea
            placeholder=''
            name='DQ3'
            required={false}
            onChange={handleChange}
          />
          <title>Sound Reasoning:</title>
          <p>
            Is there sound reasoning applied at the decision stage? Does the
            solution align with the organization's strategy and objectives, and
            its value framework? Is there confidence the benefits outweigh the
            organization's effort (time, energy, cost, resources) by an
            considerable margin to be worth it? Are the tradeoffs acceptable to
            the organization? Is timing of the decision, the implementation and
            the value delivery period acceptable to the organization?
          </p>
          <TextArea
            placeholder=''
            name='DQ4'
            required={false}
            onChange={handleChange}
          />
          <Title>Executable:</Title>
          <p>
            Can the action plan be implemented successfully with the stated
            planning quality to set reasonable expectations for scope, schedule
            and budget? Is there assigned implementer accountability and
            responsibility. Is there dedicated or secured in-house or contract
            resources?
          </p>
          <TextArea
            placeholder=''
            name='DQ5'
            required={false}
            onChange={handleChange}
          />
          <Title>Risk Tolerance:</Title>
          <p>
            Does the decision to act, or not, fall within the organization's
            shared risk tolerance? Is the minimum acceptable likelihood of
            success exceeded to proceed with the decision and action? Said in
            the negative, is the expected likelihood of failure acceptable? What
            if it is the wrong decision? Can the organization accept the worst
            plausible consequences? Is it reversible? Is a poor outcome from
            this decision acceptable to the organization? Quality decisions can
            have poor outcomes and the organization should expect and be
            tolerant of that, to a limit.
          </p>
          <TextArea
            placeholder=''
            name='DQ6'
            required={false}
            onChange={handleChange}
          />

          <Title>Commit to Action:</Title>
          <p>
            What is the confidence the action plan is achievable, will solve the
            problem and deliver expected results? Implementation turns potential
            into realized value. What resources might be reallocated to make
            this happen? What active leadership can be demonstrated through
            visible ownership and participation. How do we measure 1) we did
            what we said we'd do, and 2) we got the expected results? How doe we
            ensure
          </p>
          <TextArea
            placeholder=''
            name='DQ7'
            required={false}
            onChange={handleChange}
          />

          <Title>Change Management:</Title>
          <p>
            Will the organization support the decision, commit to execution and
            sustainment? Will there be resistance, from whom and why? Can the
            required changes in the organization be successfully carried out
            within the current culture, resources and capabilities? Does this
            present a large change to the status quo requiring new activities,
            habits and behaviours?
          </p>
          <TextArea
            placeholder=''
            name='DQ8'
            required={false}
            onChange={handleChange}
          />

          <Title>Make The Decision:</Title>
          <p>
            Now is the time - the problem-solving and decision deliberations are
            over. What is the final decision and the factors that influenced
            this choice? Why this alternative was chosen over others rejected?
            This is especially important if the recommended decision does not
            match the recommended solution.
          </p>
          <TextArea
            placeholder=''
            name='DQ9'
            required={false}
            onChange={handleChange}
          />

          <Title>Decision Contingencies:</Title>
          <p>
            Are there any guardrails identified to trigger a re-evaluation of
            the problem-solution-decision set or contingency actions? When new
            info/knowledge to certain problem-solution inputs or assumptions
            becomes available or become invalid? When implementation scope,
            schedule, cost or resource commitments go significantly off plan?
            When certain performance metrics or value delivery is not met? What
            contingency actions should take place. Be as specific as possible.
          </p>
          <TextArea
            placeholder=''
            name='DQ10'
            required={false}
            onChange={handleChange}
          />
        </Section>
        <TitleblockButtons>
          <StyledButton type='submit'>Save</StyledButton>
          <StyledButton type='submit' onClick={handleNextClick}>
            Next
          </StyledButton>
        </TitleblockButtons>
      </Container>
      <CustomSnackbar ref={customSnackbarRef} />
    </form>
  )
}

export default DecisionBlockPage
