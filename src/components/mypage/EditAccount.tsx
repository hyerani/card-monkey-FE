import { useState, useEffect } from "react";
import styled from "styled-components";
import getTokenApi from "../../api/monkeyGetToken";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {};

export const EditAccount = (props: Props) => {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const regex = /^(?=.*?[A-Za-z])(?=.*?\d)[A-Za-z\d]{8,14}$/;
  const notify = (message: string) =>
    toast.error(message, {
      position: "top-center",
      autoClose: 2000,
    });

  const handleSubmit = async (
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) => {
    const data = await getTokenApi.changePassword(
      userId,
      currentPassword,
      newPassword,
    );
    if (data !== "비밀번호 변경 완료") {
      return alert("현재 비밀번호가 일치하지 않습니다.");
    }
  };

  const handleChange = (event: any) => {
    if (regex.test(password)) {
      setNewPassword(event.target.value);
    } else {
      return notify("정확한 비밀번호 형식을 입력해주세요.");
    }
  };

  console.log(userId);
  useEffect(() => {
    const { userId } = JSON.parse(localStorage.getItem("userInfo") || "{}");
    setUserId(userId);
  }, []);

  const withdrawal = async () => {
    const res = await getTokenApi.withdrawal(userId);
    console.log(res);
  };

  return (
    <div className="myaccount">
      <div className="user-name">{userInfo.name}님의 정보 수정</div>
      <Form
        className="inputWrap"
        onSubmit={() =>
          handleSubmit(userInfo.userId, currentPassword, newPassword)
        }
      >
        <div className="group">
          <div className="inputTitle">현재 비밀번호</div>
          <input
            type="password"
            placeholder="현재 비밀번호"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="group">
          <div className="inputTitle">비밀번호</div>
          <input
            type="password"
            placeholder="새 비밀번호 (8~12자 영문 숫자 조합)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="group">
          <div className="inputTitle">비밀번호 확인</div>
          <input
            type="password"
            placeholder="새 비밀번호 확인"
            value={newPassword}
            onChange={handleChange}
          />
        </div>
        {password !== newPassword ? (
          <div className="wrong">비밀번호가 일치하지 않습니다.</div>
        ) : null}
        <ToastContainer limit={1} />
        <button
          type="submit"
          disabled={
            password !== newPassword ||
            newPassword === "" ||
            currentPassword === ""
              ? true
              : false
          }
        >
          비밀번호 변경하기
        </button>
      </Form>
      <div className="delete" onClick={() => withdrawal()}>
        회원탈퇴하기
      </div>
    </div>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  button {
    background-color: white;
    border: none;
    font-weight: 700;
    align-self: flex-end;
    cursor: pointer;
  }
  .wrong {
    margin-bottom: 10px;
    font-size: 12px;
    color: red;
    align-self: flex-end;
  }
`;
