/* eslint-disable */
import React from 'react';
import axios from 'axios';
import { TextField, Button } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components'; //CSS-IN_JS
import { useCookies } from 'react-cookie';
import { useNavigate, useLocation } from "react-router-dom";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';


const Wrapper = styled.div`
  width: 70rem;
  margin: 2rem auto;
  border-radius: 4px;
  background-color: var(--white-color);
  padding: 0.5rem 0.5rem 2rem;
  overflow: hidden;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
`;

const Spacing = styled.div`
  width: 100%;
  height: 10px;
`;
const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

const START_STAR = 0;
const END_STAR = 10;

const MenuProps = {
  PaperProps: {
    style: {
      // maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      maxWidth: 150,
      maxHeight: 150,
    },
  },
};

const EditPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const classes = useStyles();

  // eslint-disable-next-line
  const [cookies] = useCookies(['user']);
  const [isbn] = useState(location?.state?.isbn)
  const [bookInfo] = useState({
    title: location?.state?.title,
    author: location?.state?.authors[0],
    publisher: location?.state?.publisher,
    thumbnail: location?.state?.thumbnail
  });
  const [bookReportTitle, setBookReportTitle] = useState('');
  const [bookReportContent, setBookReportContent] = useState('');
  const [star, setStar] = useState('0');

  const handleStarChange = (e) => { setStar(e.target.value) };
  const starRender = () => {
    const renderResult = [];
    for (let i = START_STAR; i <= END_STAR; i++) {
      renderResult.push(<MenuItem key={i} value={i}>{i}</MenuItem>)
    }
    return renderResult;
  }


  const onClickRegBookReport = () => {
    if (bookReportTitle.trim() === "") {
      alert("????????? ????????? ??????????????????")
    }
    else if (bookReportContent.trim() === "") {
      alert("????????? ????????? ???????????????")
    }
    else if (parseInt(star) === 0) {
      alert("????????? ??????????????????")
    }
    else {
      axios.post('/api/db/books', {
        isbn: isbn,
        title: bookInfo.title,
        authors: bookInfo.author,
        publisher: bookInfo.publisher,
        thumbnail: bookInfo.thumbnail
      }).then((res) => {
        if (res.data.issuccess) {
          console.log("?????? ?????????????????????.")
        }
        else {
          console.log("?????? ????????? ????????????.")
        }
      }).catch((err) => {
        console.log(err)
        alert('??? ?????? ??? ????????? ??????????????????.')
      }).finally((err) => {
        axios.post('/api/db/bookreports', {
          title: bookReportTitle,
          contents: bookReportContent,
          rating: String(star),
          userid: cookies?.user?.userId,
          isbn: String(isbn),
        }).then((res) => {
          if (res.data.issuccess) {
            alert('???????????? ?????????????????????.')
          } else {
            alert("?????? ????????? ???????????? ????????????.")
          }
          navigate(-1)
        }).catch((err) => {
          console.log(err)
          alert('????????? ?????? ??? ????????? ??????????????????.')
        })
      })
    }
  }

  const onChangeTitle = (e) => { setBookReportTitle(e.target.value) };
  const onChangeContent = (e) => { setBookReportContent(e.target.value) };

  return (
    <Wrapper>
      <h3> ???? ????????? ????</h3>
      <form className={classes.root} noValidate autoComplete="off">
        <div>
          <TextField
            id="filled-read-only-input"
            label="??? ??????"
            style={{ width: '57%' }}
            defaultValue={bookInfo.title}
            InputProps={{
              readOnly: true,
            }}
            variant="filled"
          />
          <TextField
            id="filled-read-only-input"
            label="??????"
            defaultValue={bookInfo.author}
            InputProps={{
              readOnly: true,
            }}
            variant="filled"
          />
          <TextField
            id="filled-read-only-input"
            label="?????????"
            defaultValue={bookInfo.publisher}
            InputProps={{
              readOnly: true,
            }}
            variant="filled"
          />
        </div>
        <h3> ???? ????????? ?????? ???? </h3>
        <div>
          <TextField
            id="outlined-search"
            label="????????? ??????"
            style={{ width: '98%' }}
            type="search"
            variant="outlined"
            onChange={onChangeTitle}
            value={bookReportTitle}
          />
        </div>
        <h3>???? ?????? ????</h3>
        <div>
          <TextField
            multiline
            id="outlined-basic"
            style={{ width: '98%' }}
            placeholder="???????????? ????????? ?????????"
            variant="outlined"
            onChange={onChangeContent}
            value={bookReportContent}
          />
        </div>
        <h3>??? ?????? ???</h3>
        <Select
          style={{ width: '100px' }}
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          MenuProps={MenuProps}
          value={star}
          onChange={handleStarChange}
        >
          <MenuItem value="" disabled>???????????????</MenuItem>
          {starRender()}
        </Select>
      </form>
      <Spacing /><Spacing />
      <Button variant="contained" color="default" type="submit" onClick={onClickRegBookReport}>????????????</Button>
    </Wrapper>
  );
}

export default EditPage;
