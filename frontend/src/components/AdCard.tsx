import { Link } from "react-router-dom";
import { AdTypeCard } from "../../types";
import styled from "styled-components";
import { Button } from "./StyledButton";

const AdCardContainer = styled.div`
    background-color: white;
    border: 1px solid lightgray;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 15px;
    padding: 15px 20px;
`;

const AdCardLink = styled(Link)`
    color: black;
    text-decoration: none;
    display: block;
`;

const AdCardImg = styled.img`
    width: 100%;
    border-radius: 8px;
    margin-bottom: 5px;
`;

const AdCardTextContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const AdCardText = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
`;

const AdTagsContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
`;

const AdTag = styled.span`
    background-color: #e6f2fd;
    border-radius: 5px;
    color: #152233;
    font-size: 12px;
    font-weight: 600;
    padding: 3px 8px;
`;

export default function AdCard(
    props: AdTypeCard & { onAddToPanier: () => void }
) {
    return (
        <AdCardContainer key={props.id}>
            <AdCardLink to={`/ads/${props.id}`}>
                <AdCardImg src={props.picture} />
                <AdCardTextContainer>
                    <h4>{props.title}</h4>
                    <AdCardText>
                        <p>{props.price}€</p>
                        <AdTagsContainer>
                            {props.tags?.map((tag) => (
                                <AdTag key={tag.name}>{tag.name}</AdTag>
                            ))}
                        </AdTagsContainer>
                    </AdCardText>
                </AdCardTextContainer>
            </AdCardLink>
            <Button
                width="100%"
                transition="background-color 0.2s ease-in-out,
                color 0.2s ease-in-out"
                backgroundHover="#ffa41b"
                colorHover="white"
                onClick={props.onAddToPanier}
            >
                Ajouter au panier
            </Button>
        </AdCardContainer>
    );
}
