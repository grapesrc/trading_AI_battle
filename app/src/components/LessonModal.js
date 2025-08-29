
import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, Paper, IconButton } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function LessonModal({ open, onClose, lessonId, lessonHash }) {
  const [lessonContent, setLessonContent] = useState('');
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (open && lessonId) {
      let fileName = lessonId;
      if (lessonHash && lessonHash.length > 1) {
        // if lessonId is 'a' and hash is '#1', fileName becomes 'a1'
        fileName = lessonId + lessonHash.substring(1);
      } else if (lessonId === 'a') {
        // Default for lesson 'a'
        fileName = 'a1';
      }

      import(`../lessons/${fileName}.md`)
        .then(res => {
          fetch(res.default)
            .then(response => response.text())
            .then(text => {
              const slideDeck = text.split('---').map(slide => slide.trim());
              setSlides(slideDeck);
              setCurrentSlide(0);
            });
        })
        .catch(err => console.error("Failed to load lesson:", err));
    }
  }, [open, lessonId, lessonHash]);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="lesson-modal-title"
      aria-describedby="lesson-modal-description"
    >
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          ×
        </IconButton>
        <Paper variant="outlined" sx={{ p: 2, mt: 2, mb: 2, minHeight: '70vh', overflowY: 'auto' }}>
          {slides.length > 0 && (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                img: ({node, ...props}) => <img style={{maxWidth: '100%', height: 'auto'}} {...props} />
              }}
            >
              {slides[currentSlide]}
            </ReactMarkdown>
          )}
        </Paper>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button onClick={handlePrev} disabled={currentSlide === 0}>
            前へ
          </Button>
          <Typography>{`${currentSlide + 1} / ${slides.length}`}</Typography>
          <Button onClick={handleNext} disabled={currentSlide >= slides.length - 1}>
            次へ
          </Button>
        </Box>
        <Button onClick={onClose}>閉じる</Button>
      </Box>
    </Modal>
  );
}

export default LessonModal;
