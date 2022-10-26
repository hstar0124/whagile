import { Link } from "react-router-dom";
import ChatBotStyle from "./ChatBot.module.css";

const ChatBotScripts = [
  {
    id: "Intro",
    message: "안녕하세요. 왜-애자일 챗봇입니다.",
    trigger: "Choices",
  },
  {
    id: "Choices",
    options: [
      {
        label: "WH-AGILE 협업툴의 장점은 무엇인가요?",
        trigger: "whAgile-valuable",
      },
      {
        label: "협업툴을 사용하면서 얻게 되는 기대 효과로는 무엇이 있나요?",
        trigger: "whAgile-effects",
      },
      { label: "주요 기능에는 무엇이 있나요?", trigger: "whAgile-function" },
      {
        label: "프로젝트 세부 기능에는 무엇이 있나요?",
        trigger: "whAgile-detail",
      },
      {
        label: "1:1 문의",
        component: (
          <>
            <div className={ChatBotStyle.inqueryLinkBox}>
              <Link to={`/inquiry`}>
                <button className={ChatBotStyle.inqueryLinkBtn}>
                  1:1 문의 페이지로 이동하기
                </button>
              </Link>
            </div>
          </>
        ),
      },
    ],
  },
  {
    id: "whAgile-valuable",
    message: `핵심 기능에 집중하여 '기본'에 충실한 프로그램을 만들고자 하였습니다.
              애자일 프로세스의 '흐름'대로 업무를 처리할 수 있도록 구상하였습니다.
              애자일 프로세스를 처음 도입해보고자 하는 이들이 쉽고 '직관적'으로 사용할 수 있습니다.
              애자일 프로세스를 이해하고 '효과적'으로 애자일 프로세스를 따를 수 있도록 설계하였습니다.`,
    trigger: "Again-Intro",
  },
  {
    id: "Again-Intro",
    message: "처음으로 돌아가시겠습니까?",
    trigger: "Ask-Again",
  },
  {
    id: "Ask-Again",
    options: [
      { label: "네.", trigger: "Intro" },
      { label: "아니요. 더 이상 궁금한 게 없습니다.", trigger: "Goodbye" },
    ],
  },
  {
    id: "Goodbye",
    message: "이용해주셔서 감사합니다 :)",
  },

  {
    id: "whAgile-function",
    options: [
      { label: "프로젝트 관리", trigger: "Project" },
      { label: "스프린트 관리", trigger: "Sprint" },
      { label: "백로그 관리", trigger: "Backlog" },
      { label: "일감 관리", trigger: "Tasks" },
    ],
  },

  {
    id: "Project",
    message: `프로젝트의 주요 기능으로는 생성, 조회, 수정, 삭제, 참여 멤버 설정, 통계, 대시보드가 있습니다.`,
    trigger: "Again-Intro",
  },
  {
    id: "Sprint",
    message: `스프린트의 주요 기능으로는 생성, 수정, 완료(회고기능), 일감관리가 있습니다.`,
    trigger: "Again-Intro",
  },
  {
    id: "Backlog",
    message: `백로그의 주요 기능으로는 조회, 생성, 수정, 삭제가 있습니다.`,
    trigger: "Again-Intro",
  },
  {
    id: "Tasks",
    message: `일감의 주요 기능으로는 조회, 생성, 수정, 삭제가 있습니다.`,
    trigger: "Again-Intro",
  },

  {
    id: "whAgile-detail",
    options: [
      { label: "대시보드", trigger: "Dashboard" },
      { label: "백로그 및 스프린트", trigger: "BacklogAndSprint" },
      { label: "간트차트", trigger: "GanttChart" },
      { label: "칸반보드", trigger: "KanbanBoard" },
      { label: "히스토리", trigger: "History" },
      { label: "프로젝트관리", trigger: "ProjectInformation" },
    ],
  },

  {
    id: "Dashboard",
    message: `프로젝트 구성원은 대시보드에서 공지사항을 확인할 수 있습니다. 또한, 프로젝트 내 상태 별 일감 개수를 그래프로 한눈에 확인할 수 있습니다.`,
    trigger: "Again-Intro",
  },
  {
    id: "BacklogAndSprint",
    message: `프로젝트 구성원은 백로그와 스프린트 목록을 확인하고 추가, 생성, 삭제할 수 있습니다.`,
    trigger: "Again-Intro",
  },
  {
    id: "GanttChart",
    message: `프로젝트 구성원은 스프린트 목록을 간트 차트 형태로 확인할 수 있습니다. 또한 일감과 백로그를 추가, 생성, 삭제할 수 있습니다. `,
    trigger: "Again-Intro",
  },
  {
    id: "KanbanBoard",
    message: `프로젝트 구성원은 칸반보드에서 백로그와 일감을 추가, 생성, 수정, 삭제할 수 있습니다.`,
    trigger: "Again-Intro",
  },
  {
    id: "History",
    message: `프로젝트 구성원은 히스토리 이력을 한눈에 확인할 수 있습니다. (미정)`,
    trigger: "Again-Intro",
  },
  {
    id: "ProjectInformation",
    message: `프로젝트 구성원은 해당 프로젝트의 세부사항과 팀원 목록 및 통계를 확인할 수 있습니다.`,
    trigger: "Again-Intro",
  },

  {
    id: "whAgile-effects",
    options: [
      { label: "사용자 편의를 고려한 직관적인 UI", trigger: "Ui" },
      {
        label: "가이드 없이 쉽게, 진입 장벽은 낮게",
        trigger: "WithoutGuide",
      },
      { label: "체계적인 업무 프로세스 적용", trigger: "SystematicWork" },
      { label: "조직의 공통 목표에 대한 집중", trigger: "Concentration" },
    ],
  },

  {
    id: "Ui",
    message: `애자일 프로세스가 익숙하지 않은 사용자도 프로그램을 활용하며 자연스럽게 애자일 프로세스에 대한 개념을 이해하고 업무에 활용할 수 있습니다.`,
    trigger: "Again-Intro",
  },
  {
    id: "WithoutGuide",
    message: `애자일 프로세스의 흐름대로 업무를 처리할 수 있도록 메뉴를 구상하였습니다.
              핵심 기능만 구현하여 불필요한 기능의 학습 시간을 줄이고 바로 업무에 도입할 수 있습니다.`,
    trigger: "Again-Intro",
  },
  {
    id: "SystematicWork",
    message: `업무의 기간과 순서, 경중을 고려해서 빠르고 체계적인 업무 계획을 수립할 수 있습니다.
              whAGILE을 사용하는 개발자들 간 정보 교류 시간을 줄여 프로젝트 진행의 기간을 줄일 수 있습니다.`,
    trigger: "Again-Intro",
  },
  {
    id: "Concentration",
    message: `모든 프로젝트 구성원들이 공통의 목표에 집중할 수 있도록 업무를 나누고 책임을 명확히 합니다.`,
    trigger: "Again-Intro",
  },
];

export default ChatBotScripts;
