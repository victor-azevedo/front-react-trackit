import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import HabitTodayCard from "./HabitTodayCard";
import UserContext from "../../contexts/UserContext";
import ProgressContext from "../../contexts/ProgressContext";
import { BASE_URL } from "../../constants/urls";
import { useEffect, useState, useContext } from "react";
import {
  baseColor,
  lightTextColor,
  sequenceTextColor,
} from "../../constants/colors";
import axios from "axios";
import dayjs from "dayjs";
import styled from "styled-components";
import "dayjs/locale/pt-br";
import { useNavigate } from "react-router-dom";

export default function TodayPage() {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();

  const { progress, setProgress } = useContext(ProgressContext);
  const [habitsTodayList, setHabitsTodayList] = useState([]);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isLoadingList, setIsLoadingList] = useState(false);

  const weekDayName = dayjs().locale("pt-br").format("dddd").split("-")[0];
  const monthDay = dayjs().date();
  const month = dayjs().month() + 1;

  const refreshPage = function () {
    axios
      .get(`${BASE_URL}/habits/today`, userData.requestConfig)
      .then((res) => {
        setHabitsTodayList([...res.data]);
        refreshProgress(res.data);
        setIsLoadingPage(false);
        setIsLoadingList(false);
      })
      .catch((err) => {
        alert(err.response.data.message);
        setIsLoadingList(false);
        console.log(err.response.data);
        console.log(false);
      });
  };
  useEffect(() => {
    console.log("TodayPage");
    if (!userData?.id) {
      navigate("/");
    } else refreshPage();
  }, []);

  const refreshProgress = function (habits) {
    const habitsDone = habits.filter((h) => h.done).length;
    if (habits.length > 0) {
      setProgress(parseInt((habitsDone / habits.length) * 100));
    } else {
      setProgress(0);
    }
  };

  const renderProgressInfo = function () {
    if (!isLoadingPage) {
      return habitsTodayList.length > 0 ? (
        <p className="habits-progress" data-identifier="today-infos">
          {progress}% dos hábitos concluídos
        </p>
      ) : (
        <p className="habits-progress--not" data-identifier="today-infos">
          Nenhum hábito concluído ainda
        </p>
      );
    } else return null;
  };

  const renderTodayHabitCards = function () {
    if (isLoadingPage) return <Loading />;
    else
      return habitsTodayList.map((h) => (
        <HabitTodayCard
          key={h.id}
          habit={h}
          refreshPage={refreshPage}
          isLoadingList={isLoadingList}
          setIsLoadingList={setIsLoadingList}
        />
      ));
  };

  return (
    <ContainerTodayPage styleIsLoadingList={isLoadingList}>
      <Header />
      <MainToday>
        <TopToday>
          <h2 data-identifier="today-infos">
            {weekDayName}, {monthDay}/{month}
          </h2>
          {renderProgressInfo()}
        </TopToday>
        {renderTodayHabitCards()}
      </MainToday>
      <Footer />
    </ContainerTodayPage>
  );
}

const ContainerTodayPage = styled.div`
  max-width: 600px;
  height: 100vh;
  margin: 0 auto;
  position: relative;
  opacity: ${(props) => (props.styleIsLoadingList ? "0.5" : "1")};
  transition: all 400ms ease-in-out;
`;

const MainToday = styled.main`
  height: 100vh;
  background-color: ${baseColor};
  padding: 70px 19px 95px;
  overflow-y: auto;
  h2 {
    text-transform: capitalize;
  }
`;

const TopToday = styled.div`
  margin: 22px 0 20px;
  .habits-progress--not {
    color: ${lightTextColor};
  }
  .habits-progress {
    color: ${sequenceTextColor};
  }
`;
