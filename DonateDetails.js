import React, { useEffect, useRef, useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import API from './../../utils/API';
import Loading from './../../utils/Loading';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { DollarOutlined, ShareAltOutlined, UserAddOutlined } from '@ant-design/icons';
// import { Theme } from './Theme';
import { Audio, RotatingLines } from 'react-loader-spinner';
import { Progress } from 'antd';
import { Link } from 'react-router-dom';

export const Theme = {
    fontPrimary: "'Open Sans', sans-serif", // A clean, modern sans-serif font commonly used in fundraising platforms
    fontSecondary: "'Lato', sans-serif", // Another modern sans-serif font for variet
    fontSecondary: "'Playfair Display', serif",
    primary: '#C9A86A', // Muted gold
    secondary: '#8A7968', // Warm taupe
    accent: '#D64C31', // Deep coral
    background: '#0F1419', // Rich dark blue-gray
    surface: '#1E2328', // Slightly lighter blue-gray
    text: '#F2F2F2', // Off-white
    textDark: '#A0A0A0', // Medium gray
};

const StickyBottomBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${Theme.surface};
  padding: 10px 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: transform 0.3s ease-in-out;
  transform: ${props => props.show ? 'translateY(0)' : 'translateY(100%)'};

  @media (min-width: 769px) {
    display: none;
  }
`;


const ActionButton = styled(Button)`
  flex: 1;
  margin: 0 10px;
  background-color: ${props => props.primary ? Theme.accent : Theme.primary};
  border-color: ${props => props.primary ? Theme.accent : Theme.primary};
  color: ${Theme.text};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover, &:focus {
    background-color: ${props => props.primary ? Theme.accent : Theme.primary};
    border-color: ${props => props.primary ? Theme.accent : Theme.primary};
    opacity: 0.9;
  }

  svg {
    margin-right: 5px;
  }
`;

const PageContainer = styled.div`
  padding-top: 100px;
  padding:20px;
  @media (max-width: 768px) {
    padding-top:10px;
  }
`;
const ResponsiveContainer = styled(Container)`
    padding:20px;
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const ResponsiveRow = styled(Row)`
  @media (max-width: 768px) {
    margin-top: 100px;
  }
`;

const ResponsiveCol = styled(Col)`
  @media (max-width: 768px) {
    padding: 0;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Title = styled.h3`
  font-family: ${Theme.fontSecondary};
  color: ${Theme.primary};
  text-align: left;
`;

const ImageContainer = styled.div`
  width: 600px;
  height: 387px;
  overflow: hidden;
  border-radius: 12px;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: left;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
  }
`;

const ResponsiveImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  border-radius: 12px;
`;

const IconWrapper = styled.div`
  font-size: 2rem;
  color: ${Theme.primary};
  margin-right: 0.5rem;
  display: inline-flex;
  align-items: center;
`;

const CreatorInfo = styled.p`
  margin-top: 30px;
  text-align: left;
  display: flex;
  align-items: center;
  font-family: ${Theme.fontPrimary};
`;

const Divider = styled.hr`
  border: none;
  height: 2px;
  background-color: ${Theme.primary};
  width: 100%;
  margin: 20px 0;
`;

const Description = styled.p`
  margin-bottom: 10px;
  text-align: justify; /* or text-align: left if you prefer */
  color: whitesmoke;
  line-height: 1.5; /* Adjust line height for better readability */
  word-spacing: 0.1em; /* Adjust word spacing for balance */
`;

const DonationCard = styled.div`
  padding: 20px;
  margin-top: 70px;
  border-radius: 12px;
  background-color: ${Theme.surface};
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  width: 300px;
  margin-left: 20px;

  @media (max-width: 768px) {
    width: 100%;
    margin-left: 0;
    margin-top: 20px;
  }
`;

const ProgressBar = styled.div`
  background-color: black;
  border-radius: 5px;
  overflow: hidden;
  height: 20px;
`;

const ProgressFill = styled.div`
  width: ${props => props.percent}%;
  background-color: ${Theme.secondary};
  height: 100%;
  transition: width 0.5s ease-in-out;
`;

const CommentSection = styled.div`
  margin-top: 40px;
`;

const CommentTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const CommentHeader = styled.th`
  border-bottom: 2px solid #ccc;
  padding: 10px;
  text-align: center;
  color: ${Theme.text};
`;

const CommentCell = styled.td`
  padding: 10px;
  color: ${Theme.text};
  border-bottom: 1px solid #ccc;
`;

const StyledForm = styled(Form)`
  .form-control {
    background-color: #2B3036;
    color: ${Theme.text};
    border-color: ${Theme.primary};
  }
`;

const StyledButton = styled(Button)`
  background-color: ${Theme.accent};
  border-color: ${Theme.accent};
`;

const DonateDetails = ({ match }) => {
    const id = match.params.id;
    const [isLoading, setIsLoading] = useState(false);
    const [campaign, setCampaign] = useState(null);
    const [donorName, setDonorName] = useState('Anonymous');
    const [donationAmount, setDonationAmount] = useState('');
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [topDonor, setTopDonor] = useState(null);
    const [isCommentEnabled, setIsCommentEnabled] = useState(false);

    useEffect(() => {
        loadCampaignDetails();
        populateDonorName();
        loadComments();
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        setIsCommentEnabled(!!userData);
    }, []);

    const loadCampaignDetails = async () => {
        setIsLoading(true);
        try {
            const res = await API.getAllCampaigns();
            const campaignDetails = res.data.find(campaign => campaign._id === id);
            if (campaignDetails) {
                setCampaign(campaignDetails);
                const donations = campaignDetails.donations || [];
                const topDonor = donations.reduce((max, donor) =>
                    donor.amount > max.amount ? donor : max,
                    { amount: 0 }
                );
                setTopDonor(topDonor.amount > 0 ? topDonor : null);
            } else {
                console.error('Campaign not found');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const populateDonorName = () => {
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        if (userData && userData.name) {
            setDonorName(userData.name);
        }
    };

    const loadComments = async () => {
        try {
            const response = await API.getCampaignComments(id);
            setComments(response.data.comments);
        } catch (error) {
            console.error("Error fetching comments:", error);
            alert("There was an error fetching comments. Please try again.");
        }
    };

    // const handleDonate = async () => {
    //     if (!donationAmount || donationAmount <= 0) {
    //         alert("Please enter a valid donation amount greater than zero.");
    //         return;
    //     }

    //     try {
    //         await API.donateToCampaign(id, { donorName, amount: donationAmount });
    //         alert("Thank you for your donation!");
    //         await loadCampaignDetails();
    //         setDonationAmount('');
    //     } catch (error) {
    //         console.error("Error donating:", error);
    //         alert("There was an error processing your donation. Please try again.");
    //     }
    // };
    const [showStickyBar, setShowStickyBar] = useState(true);
    const donateCardRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (donateCardRef.current) {
                const rect = donateCardRef.current.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
                setShowStickyBar(!isVisible);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check initial state

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleShare = async () => {
        if (!campaign) {
            alert('Campaign data is not available.');
            return;
        }

        if (navigator.share) {
            try {
                await navigator.share({
                    title: campaign.title,
                    text: `Check out this fundraising campaign: ${campaign.title}`,
                    url: window.location.href,
                });
            } catch (error) {
                console.error('Error sharing the campaign:', error);

            }
        } else {
            alert('Web Share API is not supported in your browser. You can manually copy the URL to share.');
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        const name = userData ? userData.name : null;

        if (!name) {
            alert("You must be logged in to add a comment.");
            return;
        }

        if (!newComment) {
            alert("Please enter a comment.");
            return;
        }

        try {
            await API.addCommentInCampaign(id, { name, comment: newComment });
            alert("Comment added!");
            setNewComment('');
            loadComments();
        } catch (error) {
            console.error("Error adding comment:", error);
            alert("There was an error adding your comment. Please try again.");
        }
    };

    if (isLoading || !campaign) {
        return (
            <ResponsiveContainer fluid style={{
                backgroundColor: Theme.background,
                color: Theme.text,
                height: '100vh', // Take up full viewport height
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <RotatingLines
                    height="40"
                    width="40"
                    radius="9"
                    strokeColor={Theme.primary} // Use strokeColor instead of color
                    ariaLabel="loading"
                />
            </ResponsiveContainer>
        );
    }
    const MobileOnlyComponent = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;
    const NonMobileComponent = styled.div`
 display: block;
  @media (max-width: 768px) {
 display: none;
  }
`;
    return (
        <ResponsiveContainer fluid style={{ backgroundColor: Theme.background, color: Theme.text, padding: '20px' }}>
            <PageContainer>
                <ResponsiveRow className="justify-content-center">
                    <ResponsiveCol md={8}>
                        <FlexContainer>
                            <ContentContainer>
                                <Title>{campaign.title}</Title>
                                <ImageContainer>
                                    {campaign.image && (
                                        <ResponsiveImage src={campaign.image} alt={campaign.title} />
                                    )}
                                </ImageContainer>
                                <CreatorInfo>
                                    <IconWrapper>
                                        <UserAddOutlined />
                                    </IconWrapper>
                                    {campaign.createdUsername} Started this Fundraiser
                                </CreatorInfo>
                                <Divider />
                                <Description>
                                    <strong style={{ color: Theme.primary, fontFamily: Theme.fontPrimary }}>Description:</strong> {campaign.description}
                                </Description>
                                <Divider />
                                <p style={{ textAlign: 'left' }}>
                                    <strong style={{ color: Theme.primary, fontFamily: Theme.fontPrimary }}>Contact The Creator: </strong> {campaign.createdUserEmail}
                                </p>
                            </ContentContainer>

                            <DonationCard ref={donateCardRef}>
                                <div style={{ marginTop: '20px' }}>
                                    {(() => {
                                        const percent = (campaign.amountRaised / campaign.goal) * 100;
                                        return (
                                            <>
                                                <MobileOnlyComponent>

                                                        <Progress
                                                            showInfo={false}
                                                            type="circle"
                                                            strokeWidth={20}
                                                            strokeColor={Theme.primary}
                                                            percent={percent}
                                                            width={60}


                                                        />
<br/>
<br/>
                                                </MobileOnlyComponent>

                                                <NonMobileComponent>
                                                    <ProgressBar>
                                                        <ProgressFill percent={percent} />
                                                    </ProgressBar>
                                                </NonMobileComponent>
                                                <p style={{ color: 'primary', fontFamily: 'fontPrimary', marginTop: '5px' }}>
                                                    ${campaign.amountRaised} raised of ${campaign.goal} goal
                                                </p>
                                            </>
                                        );
                                    })()}
                                </div>

                                <p style={{ textAlign: 'left' }}><strong style={{ color: Theme.primary }}>Amount Raised:</strong> ${campaign.amountRaised}</p>
                                <p style={{ textAlign: 'left' }}><strong style={{ color: Theme.primary }}>Goal:</strong> ${campaign.goal}</p>

                                {topDonor && (
                                    <div style={{ marginBottom: '15px', color: Theme.text, textAlign: 'left' }}>
                                        <strong style={{ color: Theme.primary }}>Top Donor:</strong> {topDonor.donorName} - ${topDonor.amount}
                                    </div>
                                )}

                                <StyledForm>
                                    <Form.Group controlId="donorName">
                                        <Form.Label style={{ color: Theme.primary, fontFamily: Theme.fontPrimary }}>Donor Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your name"
                                            value={donorName}
                                            readOnly
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="donationAmount">
                                        <Form.Label style={{ color: Theme.primary, fontFamily: Theme.fontPrimary }}>Donation Amount ($)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Enter amount"
                                            value={donationAmount}
                                            onChange={(e) => setDonationAmount(e.target.value)}
                                            onWheel={(e) => e.preventDefault()}
                                            min="0"
                                            style={{ appearance: 'none', MozAppearance: 'textfield' }}
                                        />
                                    </Form.Group>

                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Link
                                   to={`/donation?id=${id}`}
                                   style={{ backgroundColor: '#D64C31', borderColor: '#D64C31', color: 'white', padding: '10px 20px', textDecoration: 'none', borderRadius: '4px' }}
                               >
                                   Donate
                               </Link>
                                        <ActionButton onClick={handleShare}>
                                            <ShareAltOutlined /> Share
                                        </ActionButton>
                                    </div>


                                </StyledForm>
                            </DonationCard>
                        </FlexContainer>

                        <CommentSection>
                            <h4 style={{ color: Theme.primary, textAlign: 'left' }}>Words of support</h4>
                            <StyledForm onSubmit={handleCommentSubmit}>
                                <Form.Group controlId="newComment">
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Add a comment..."
                                        value={newComment}
                                        disabled={!isCommentEnabled}
                                        onChange={(e) => setNewComment(e.target.value)}
                                    />
                                </Form.Group>
                                <StyledButton type="submit" disabled={!isCommentEnabled}>
                                    Submit Comment
                                </StyledButton>
                            </StyledForm>

                            <div style={{ marginTop: '20px' }}>
                                {comments.length > 0 ? (
                                    <CommentTable>
                                        <thead>
                                            <tr>
                                                <CommentHeader>Name</CommentHeader>
                                                <CommentHeader>Comment</CommentHeader>
                                                <CommentHeader>Created On</CommentHeader>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {comments.map((comment, index) => (
                                                <tr key={index}>
                                                    <CommentCell>{comment.name}</CommentCell>
                                                    <CommentCell>{comment.comment}</CommentCell>
                                                    <CommentCell>{new Date(comment.createdOn).toLocaleString()}</CommentCell>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </CommentTable>
                                ) : (
                                    <p>No comments yet.</p>
                                )}
                            </div>
                        </CommentSection>
                    </ResponsiveCol>
                </ResponsiveRow></PageContainer>
            <StickyBottomBar show={showStickyBar}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Link
                                   to={`/donation?id=${id}`}
                                   style={{ backgroundColor: '#D64C31', borderColor: '#D64C31', color: 'white', padding: '10px 20px', textDecoration: 'none', borderRadius: '4px' }}
                               >
                                   Donate
                               </Link>
                <ActionButton onClick={handleShare}>
                    <ShareAltOutlined /> Share
                </ActionButton>
                </div>
            </StickyBottomBar>
            
        </ResponsiveContainer>

    );

};

export default withRouter(DonateDetails);
