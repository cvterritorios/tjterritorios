import React from "react";
import { Badge, Card, Col, Row } from "react-bootstrap";
import {
  GrStatusCritical,
  GrStatusCriticalSmall,
  GrStatusGood,
} from "react-icons/gr";
import { RxCrossCircled } from "react-icons/rx";

const RefTags = ({ item, setTag, setSearchTag, noCliquable = false }) => {
  return (
    <>
      {item.references.map((ref, idx) => (
        <Badge
          key={idx}
          bg="bg-gray"
          text="dark"
          className={`border bg-gray-300 w-fit m-1 truncate ${
            noCliquable ? "" : "hover:cursor-pointer"
          }`}
          title={ref}
          onClick={
            noCliquable
              ? undefined
              : () => {
                  setTag(ref);
                  setSearchTag(true);
                }
          }
        >
          {ref}
        </Badge>
      ))}
    </>
  );
};

const AvailableStatus = ({ item = {}, value = false, isPaint = false }) => {
  return (
    <>
      {value && (
        <>
          {value ? (
            <span
              className={`text-success flex items-center ${
                isPaint ? "bg-green-50" : ""
              } `}
            >
              Disponivel <GrStatusGood size={16} className="ml-1" />
            </span>
          ) : (
            <span
              className={`text-danger flex items-center ${
                isPaint ? "bg-red-50" : ""
              } `}
            >
              Indisponivel <RxCrossCircled size={16} className="ml-1" />
            </span>
          )}
        </>
      )}
      {!value && (
        <>
          {item && (
            <>
              {item.available ? (
                <span
                  className={`text-success flex items-center ${
                    isPaint ? "bg-green-50" : ""
                  } `}
                >
                  Disponivel <GrStatusGood size={16} className="ml-1" />
                </span>
              ) : (
                <span
                  className={`text-danger flex items-center ${
                    isPaint ? "bg-red-50" : ""
                  } `}
                >
                  Indisponivel <RxCrossCircled size={16} className="ml-1" />
                </span>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

const CardsGrid = ({
  item,
  handleShowOpcoesModal,
  setTerritoryNowData,
  setTag,
  setSearchTag,
  noCliquable = false,
}) => {
  const handleClick = (item) => {
    setTerritoryNowData({
      ...item,
    });
    handleShowOpcoesModal();
  };
  return (
    <Card className="border rounded w-[10rem] md:w-[20rem] md:h-[20rem]">
      <Card.Body className="text-center h-full">
        <Row className="h-1/2 ">
          <Card.Img
            className="h-full w-full hover:cursor-pointer"
            variant="top"
            onClick={() => {
              handleClick(item);
            }}
            src={item.map}
          ></Card.Img>
        </Row>

        <Row
          className="font-bold my-1 text-base truncate text-start hover:cursor-pointer m-auto"
          onClick={() => {
            handleClick(item);
          }}
        >
          {item.description}
        </Row>

        <div className="divide-y-2">
          <Row className="text-base">
            <AvailableStatus item={item} isPaint />
          </Row>

          <Row className="w-full flex m-auto" name="references">
            <RefTags
              item={item}
              setTag={setTag}
              setSearchTag={setSearchTag}
              noCliquable={noCliquable}
            />

          </Row>
          
        </div>
        
        {BoxOfText({text: item.observation, title: "Observação" })}
      </Card.Body>
    </Card>
  );
};

const CardsList = ({
  item,
  handleShowOpcoesModal,
  setTerritoryNowData,
  setTag,
  setSearchTag,
  noCliquable = false,
}) => {
  const handleClick = (item) => {
    setTerritoryNowData({
      ...item,
    });
    handleShowOpcoesModal();
  };

  return (
    <Card className="border border-end-0 border-start-0 rounded-0 md:w-[25rem] w-[23.4rem] h-[6rem]">
      <Card.Body className="text-center ">
        <Row className="">
          <Col xs={3} className="p-0 h-full">
            <Card.Img
              className="h-16 w-full hover:cursor-pointer"
              onClick={() => {
                handleClick(item);
              }}
              variant="top"
              src={item.map}
            ></Card.Img>
          </Col>
          <Col className="px-1">
            <Row className="justify-between flex">
              <Col
                className="font-bold text-base text-start ml-2 hover:cursor-pointer"
                name="Description"
                onClick={() => {
                  handleClick(item);
                }}
              >
                {item.description}
              </Col>
              <Col className="" name="availeble">
                <div className="text-end text-base">
                  <AvailableStatus item={item} />
                </div>
              </Col>
            </Row>
            <Row className="w-full flex m-2" name="references">
              <RefTags
                item={item}
                setTag={setTag}
                setSearchTag={setSearchTag}
                noCliquable={noCliquable}
              />
            </Row>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

const BoxOfText = ({ text = "", component = null, title }) => {
  const format =
    "border bg-gray-100 my-2 border-black w-full rounded pt-2.5 p-2 text-xs ";

    if(!text){
      return <div className="w-full h-16 pt-3"> - Sem {title} - </div>
    }

  return (
    <div className="relative border-2 border-transparent w-full ">
      <div className="absolute bg-gray-200 border border-black rounded px-1 text-[10px] top-0.5 start-5 w-fit">
        {title}
      </div>
      {text && (
        <textarea disabled className={format} value={text}>
          {text}
        </textarea>
      )}
      {component && <div className={format}>{component}</div>}
    </div>
  );
};

const AssignmentInfo = ({ publisher, date, responsible }) => {
  const format =
    "border bg-gray-100 my-2 border-black w-full rounded py-2 px-2.5";

  return (
    <div className="relative border-2 border-transparent w-full ">
      <div className="absolute bg-gray-200 border border-black rounded px-1 text-[10px] top-0.5 start-5 w-fit">
        Atribuido em {date}
      </div>
      <div className={format}>
        <div className="flex justify-evenly items-center">
          <span className="font-bold text-lg">{publisher}</span>
        </div>
      </div>
      <div className="absolute bg-gray-200 border border-black rounded px-1 text-[12px] bottom-0 end-5 w-fit">
        Por: {responsible}
      </div>
    </div>
  );
};

export {
  RefTags,
  AvailableStatus,
  CardsGrid,
  CardsList,
  BoxOfText,
  AssignmentInfo,
};
