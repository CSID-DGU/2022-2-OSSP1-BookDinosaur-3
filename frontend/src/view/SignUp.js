import { Button } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import MenuItem from "@material-ui/core/MenuItem";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

const START_AGE = 10;
const END_AGE = 100;

const MenuProps = {
  PaperProps: {
    style: {
      maxWidth: 60,
      maxHeight: 240,
    },
  },
};

const SignUp = () => {
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [nickName, setNickName] = useState("");
  const [pw, setPw] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");

  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [genre, setGenre] = useState({
    checkedA: false,
    checkedB: false,
    checkedC: false,
    checkedD: false,
    checkedE: false,
    checkedF: false,
    checkedG: false,
    checkedH: false,
    checkedI: false,
    checkedJ: false,
  });

  const onChangeId = (e) => {
    setId(e.target.value);
  };
  const onChangeNickName = (e) => {
    setNickName(e.target.value);
  };
  const onChangePw = (e) => {
    setPw(e.target.value);
  };
  const onChangePwConfirm = (e) => {
    setPwConfirm(e.target.value);
  };

  const handleAgeChange = (e) => {
    setAge(e.target.value);
  };
  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleGenreChange = (e) => {
    setGenre({ ...genre, [e.target.name]: e.target.checked });
  };

  const ageRender = () => {
    const renderResult = [];
    for (let i = START_AGE; i < END_AGE; i++) {
      renderResult.push(
        <MenuItem key={i} value={i}>
          {i}
        </MenuItem>
      );
    }
    return renderResult;
  };

  const checkId = () => {
    if (id !== "") return !(3 < id.length && id.length < 17);
    return false;
  };

  const checkNick = () => {
    if (nickName !== "") return !(1 < nickName.length && nickName.length < 11);
    return false;
  };

  const checkPw = () => {
    if (pw !== "") return !(7 < pw.length && pw.length < 17);
    return false;
  };

  const convertAgeRange = (age) => {
    if (age < 20) {
      return 0;
    } else if (age < 30) {
      return 1;
    } else if (age < 40) {
      return 2;
    } else if (age < 50) {
      return 3;
    } else if (age < 60) {
      return 4;
    } else {
      return 5;
    }
  };

  const replaceCharAt = (str, index, chr) => {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
  };

  const getConvertedGenreText = (genre) => {
    let genreText = "0,0,0,0,0,0,0,0,0,0";

    if (genre.checkedA) genreText = replaceCharAt(genreText, 0, "1");
    if (genre.checkedB) genreText = replaceCharAt(genreText, 2, "1");
    if (genre.checkedC) genreText = replaceCharAt(genreText, 4, "1");
    if (genre.checkedD) genreText = replaceCharAt(genreText, 6, "1");
    if (genre.checkedE) genreText = replaceCharAt(genreText, 8, "1");
    if (genre.checkedF) genreText = replaceCharAt(genreText, 10, "1");
    if (genre.checkedG) genreText = replaceCharAt(genreText, 12, "1");
    if (genre.checkedH) genreText = replaceCharAt(genreText, 14, "1");
    if (genre.checkedI) genreText = replaceCharAt(genreText, 16, "1");
    if (genre.checkedJ) genreText = replaceCharAt(genreText, 18, "1");

    return genreText;
  };

  const onClickSignUp = () => {
    if (id === "" || checkId()) {
      alert("아이디를 입력해주세요.");
    } else if (nickName === "" || checkNick()) {
      alert("닉네임을 입력해주세요.");
    } else if (pw === "" || checkPw()) {
      alert("비밀번호를 입력해주세요.");
    } else if (pwConfirm === "") {
      alert("비밀번호를 확인을 입력해주세요.");
    } else if (pw !== pwConfirm) {
      alert("비밀번호를 확인해주세요.");
    } else if (!age) {
      alert("나이를 선택해주세요.");
    } else if (!genre) {
      alert("장르를 선택해주세요.");
    } else {
      const genreText = getConvertedGenreText(genre);
      // id부터 sexuality까지를 body에 넣어 전달
      axios
        .post("/api/db/users", {
          userid: id,
          password: pw,
          nickname: nickName,
          age: convertAgeRange(age),
          sexuality: gender,
          // 장르
          preference: genreText,
        })
        .then((res) => {
          if (res.data.issuccess) {
            alert("회원가입 되었습니다! 로그인해주세요.");
            navigate("/");
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
          alert("회원가입 중 오류가 발생했습니다.");
        });
    }
  };

  return (
    <div className="signup-area">
      {/* <Header /> */}
      <div className="flex-vertical left_box">
        <h2>필수정보</h2>

        <TextField
          error={checkId()}
          helperText={checkId() ? "4~16자 사이로 입력해주세요" : ""}
          label="아이디"
          onChange={onChangeId}
        />
        <TextField
          label="닉네임"
          onChange={onChangeNickName}
          error={checkNick()}
          helperText={checkNick() ? "2~10자 사이로 입력해주세요" : ""}
        />
        <TextField
          type="password"
          label="패스워드"
          onChange={onChangePw}
          error={checkPw()}
          helperText={checkPw() ? "8~16자 사이로 입력해주세요" : ""}
        />
        <TextField
          error={pwConfirm !== "" ? pw !== pwConfirm : false}
          helperText={
            pwConfirm !== "" && pw !== pwConfirm
              ? "패스워드를 확인해주세요"
              : ""
          }
          type="password"
          label="패스워드 확인"
          onChange={onChangePwConfirm}
        />
      </div>

      <div className="flex-vertical right_box">
        <h2>추가정보</h2>

        <h4>나이</h4>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          MenuProps={MenuProps}
          value={age}
          onChange={handleAgeChange}
        >
          <MenuItem value="" disabled>
            선택하세요
          </MenuItem>
          {ageRender()}
        </Select>

        <h4>성별</h4>
        <RadioGroup
          className="gender-box"
          aria-label="gender"
          name="gender1"
          value={gender}
          onChange={handleGenderChange}
        >
          <FormControlLabel
            value="M"
            control={<Radio />}
            labelPlacement="start"
            label="남자"
          />
          <FormControlLabel
            value="F"
            control={<Radio />}
            labelPlacement="start"
            label="여자"
          />
        </RadioGroup>

        <h4>관심 장르</h4>
        {/* 콤보박스 */}
        {/* '총류(기타)', '철학', '종교', '사회과학', '자연과학', '기술과학', '예술', '언어', '문학', '역사' */}
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={genre.checkedA}
                onChange={handleGenreChange}
                name="checkedA"
                color="primary"
              />
            }
            label="총류(기타)"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={genre.checkedB}
                onChange={handleGenreChange}
                name="checkedB"
                color="primary"
              />
            }
            label="철학"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={genre.checkedC}
                onChange={handleGenreChange}
                name="checkedC"
                color="primary"
              />
            }
            label="종교"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={genre.checkedD}
                onChange={handleGenreChange}
                name="checkedD"
                color="primary"
              />
            }
            label="사회과학"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={genre.checkedE}
                onChange={handleGenreChange}
                name="checkedE"
                color="primary"
              />
            }
            label="자연과학"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={genre.checkedF}
                onChange={handleGenreChange}
                name="checkedF"
                color="primary"
              />
            }
            label="기술과학"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={genre.checkedG}
                onChange={handleGenreChange}
                name="checkedG"
                color="primary"
              />
            }
            label="예술"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={genre.checkedH}
                onChange={handleGenreChange}
                name="checkedH"
                color="primary"
              />
            }
            label="언어"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={genre.checkedI}
                onChange={handleGenreChange}
                name="checkedI"
                color="primary"
              />
            }
            label="문학"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={genre.checkedJ}
                onChange={handleGenreChange}
                name="checkedJ"
                color="primary"
              />
            }
            label="역사"
          />
        </FormGroup>

        <Button variant="contained" color="primary" onClick={onClickSignUp}>
          회원가입
        </Button>
      </div>
    </div>
  );
};

export default SignUp;
