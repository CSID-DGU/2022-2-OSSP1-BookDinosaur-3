import React, { useState, useEffect } from "react"
import axios from "axios"
import "./CosineRecommend.css"
import { Link } from "react-router-dom"

const CosineRecommend = (props) => {
    const [RecommendList, setRecommendList] = useState([])

    useEffect(() => {
        async function fetchData() {
            try {
                await axios.get("/api/recommend/cos").then((res) => {
                    setRecommendList(res.data.data || [])
                })
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
    }, [])

    let rankDisplay = 1

    return (
        <div className="Recommend-area">
            {RecommendList.length
                ? RecommendList.map((data, index) => {
                      return (
                          <div key={index}>
                              <Link
                                  to="/GatherReportPage"
                                  state={data}
                                  style={{ color: "inherit" }}
                              >
                                  <div className="recommend-box">
                                      <div className="title">
                                          <h3> 👑 {rankDisplay++} 위 </h3>
                                          <p className="centerBookTitle">
                                              {data.title}
                                          </p>
                                      </div>
                                      <div className="bookContent">
                                          <img
                                              src={data.thumbnail_M}
                                              alt="thumbnail"
                                          />
                                      </div>
                                  </div>
                              </Link>
                          </div>
                      )
                  })
                : "추천해드릴 만한 책을 찾지 못했습니다."}
        </div>
    )
}

export default CosineRecommend
