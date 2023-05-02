import React, { useState } from 'react'
import useFetch from '../hooks/useFetch'
import './searchBarLabels.scss'
import Skeleton from '../components/Skeleton'

const SearchBarLabels = (props) => {
    let [labelSeleted, setLabelSeleted] = useState([])

    props.selectLB(labelSeleted)//將選中的label傳回Searchbar

    const [isOptionChanged, setisOptionChanged] = useState(false)
    let labels = []
    const { data, loading, error } = useFetch('/labels/top10Labels/')
    labels = data

    const labelClick = (item) => {
        labelSeleted.includes(item) ? labelSeleted.splice(labelSeleted.indexOf(item), 1) : labelSeleted.push(item)
        setLabelSeleted(labelSeleted)
    }

    return (
        <div className="labels">
            <div className="title">Hashtag</div>
            {loading ? <Skeleton type="searchBarLabel" length={5}/> :
                <><div className="labelView">
                    {
                        labels.slice(0, 10).map((item, i) => {
                            return <p key={i} className={`label ${labelSeleted.includes(item.labelName) ? 'labelsActive' : ''}`} onClick={() => {
                                labelClick(item.labelName)
                                setisOptionChanged(!isOptionChanged)
                            }}>#{item.labelName}</p>
                        })
                    }
                    {/* <p className="label">#台南</p>
                                    <p className="label">#餐廳</p> */}
                </div></>
            }
        </div>
    )
}

export default SearchBarLabels