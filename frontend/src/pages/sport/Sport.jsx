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
import { useResultContext } from "../../context/ResultContext";

export default function Sport() {
  const navigate = useNavigate();
  const [sports, setSports] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const { dialogRef } = useResultContext();

  const pageLength = 3;
  const token =
    "8mTvr1VPxmamgrHenYNXw_rJg-qJBFe-H71w2lZlbfn_ETZaBoL5o296rsvfSoGgJdgWAXkkHE-DixpQ7HcIT0Kc_iVTLdzYxTln-cELuo8YI_oIVYV7S-rr6c8zZvKBx0q1oKUz1v7_phQ6voMK8sp7DnLOHG2qpzYepbo6wM8bL3UvYLHhMdaKaAtkqMNQjZ_YMCbppDjxFSMaPZq8QgbEwoCszssw2HiZtQxs33NYz0k4orTj8X36uD5LS1YKEPImZ3sxbqL1PncAIGWmW7tcQsuUFSCk7POI9v0tAdKN7CpmjfaYtZsB67DnqbHg5XcBhoD8kYZ3q_PyoKuNt8ioYFCXNoP4ysfnjlNiFiHQcov8REIlWAIg97LD7gjM3GUmB_O9A5BV1ZUp17Q1Z5Pd-RroInuCmCb-etTPlkrRNnkPNxbZ7g0wgOGcMwcQ_yD6tAdCAIJ_9dcEgzkM8PzNyiMn8wXzIwcXwVF74bRD_CwJg49cylgRX9k4g9bxDkNFGreoi2Ld7Sfj5avZBg";

  useEffect(() => {
    fetchSportsAsync();
  }, [pageNumber]);

  async function fetchSportsAsync() {
    try {
      await API.get(`/sport?pageSize=${pageLength}&pageNumber=${pageNumber}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
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
        headers: {
          Authorization: "Bearer " + token,
        },
      }).then(() => {
        fetchSportsAsync();
        toast.success("Sport deleted");
      });
    } catch (e) {
      toast.error("Sport not deleted");
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
