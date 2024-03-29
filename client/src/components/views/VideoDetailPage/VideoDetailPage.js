import React, { useEffect, useState } from 'react'
import { List, Avatar, Row, Col } from 'antd';
import axios from 'axios';
import SideVideo from './Sections/SideVideo'
import Subscribe from './Sections/Subscriber'
import Comment from './Sections/Comment'
import LikeDislikes from './Sections/LikeDislikes'

function VideoDetailPage(props) {

    const videoId = props.match.params.videoId
    const [Video, setVideo] = useState([])
    const [Comments, setComments] = useState([])
    const videoVariable = {videoId: videoId}

    useEffect(() => {
        axios.post('/api/video/getVideo', videoVariable)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.video)
                    setVideo(response.data.video)
                } else {
                    alert('비디오 정보를 가져오는 것을 실패했습니다.')
                }
            })
        axios.post('/api/comment/getComment', videoVariable)
            .then(response => {
                if (response.data.success) {
                    setComments(response.data.comments)
                }
                else {
                    alert('답글 정보를 가져오는 것을 실패했습니다.')
                }
            })
    }, [])

    const refreshFunction = (newComment) => {
        setComments(Comments.concat(newComment))
    }
    if (Video.writer) {

        const subscribeButton = Video.writer_id !== localStorage.getItem('userId') && <Subscribe userTo={Video.writer._id} userFrom={localStorage.getItem('userId')}/>
        return (
            <Row>
                <Col lg={18} xs={24}>
                    <div className="postPage" style={{ width: '100%', padding: '3rem 4em' }}>
                        <video style={{ width: '100%' }} src={`http://localhost:5000/${Video.filePath}`} controls></video>

                        <List.Item
                            actions={[<LikeDislikes video userId={localStorage.getItem('userId')} videoId={videoId} /> , subscribeButton]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={Video.writer && Video.writer.image} />}
                                title={<a href="https://ant.design">{Video.title}</a>}
                                description={Video.description}
                            />
                            <div></div>
                        </List.Item>
                        {/* Comments */}
                        <Comment refreshFunction={refreshFunction} commentLists={Comments} postId={videoId}/>
                    </div>
                </Col>
                <Col lg={6} xs={24}>
                    {/* <SideVideo /> */}
                    <SideVideo />
                </Col>
            </Row>
        )

    } else {
        return (
            <div>Loading...</div>
        )
    }


}
export default VideoDetailPage
