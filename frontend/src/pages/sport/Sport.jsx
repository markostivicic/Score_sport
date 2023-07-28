import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import Navbar from "../../components/Navbar";
import Pagination from "../../components/Pagination";
import API from "../../services/AxiosService";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuid } from "uuid";
import { toast } from "react-toastify";
import { getHeaders } from "../../services/AuthService";

export default function Sport() {
  const navigate = useNavigate();
  const [sports, setSports] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const pageLength = 3;

  useEffect(() => {
    fetchSportsAsync();
  }, [pageNumber]);

  async function fetchSportsAsync() {
    try {
      await API.get(`/sport?pageSize=${pageLength}&pageNumber=${pageNumber}`, {
        headers: getHeaders(),
      }).then((response) => {
        setSports(response.data.items);
        setPageCount(Math.ceil(response.data.totalCount / pageLength));
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function deleteSportAsync(id) {
    try {
      await API.delete(`/sport/toggle/${id}`, {
        headers: getHeaders(),
      }).then(() => {
        fetchSportsAsync();
        toast.success("Sport obrisan");
      });
    } catch (e) {
      toast.error("Sport nije obrisan");
      console.log(e);
    }
  }

  function renderData() {
    return sports.map((sport) => {
      return (
        <tr key={uuid()}>
          <td>{sport.name}</td>
          <td>
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => navigate(`/sport/update/${sport.id}`)}
              icon={faPenToSquare}
            />
          </td>
          <td>
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to delete this sport?")
                ) {
                  deleteSportAsync(sport.id);
                }
              }}
              icon={faTrash}
            />
          </td>
        </tr>
      );
    });
  }

  const changePage = ({ selected }) => {
    setPageNumber(selected + 1);
  };

  return (
    <div>
      <Navbar />
      <Table tableHeaders={["Name"]} renderData={renderData} />
      <Pagination pageCount={pageCount} changePage={changePage} />
    </div>
  );
}
