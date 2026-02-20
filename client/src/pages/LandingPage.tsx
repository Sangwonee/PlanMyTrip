import React from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(22px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

const Page = styled.div`
  min-height: 100vh;
  background:
    radial-gradient(700px 480px at 15% 10%, rgba(55, 122, 69, 0.09), transparent 70%),
    radial-gradient(580px 420px at 90% 22%, rgba(74, 156, 93, 0.11), transparent 72%),
    var(--color-bg);
  overflow-x: hidden;
`;

const Nav = styled.nav`
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 100;
  height: 70px;
  padding: 0 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(245, 249, 242, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-border);

  @media (max-width: 900px) {
    padding: 0 18px;
  }
`;

const NavLogo = styled.button`
  display: flex;
  align-items: center;
`;

const NavLogoImage = styled.img`
  width: 156px;
  height: auto;
  display: block;

  @media (max-width: 900px) {
    width: 132px;
  }
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;

  @media (max-width: 900px) {
    gap: 10px;
  }
`;

const NavLink = styled.button`
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-secondary);
  transition: color var(--transition-fast);

  &:hover {
    color: var(--color-accent-dark);
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

const NavCta = styled.button`
  padding: 10px 20px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-bright));
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  box-shadow: 0 10px 24px rgba(74, 156, 93, 0.22);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 28px rgba(74, 156, 93, 0.28);
  }

  @media (max-width: 900px) {
    padding: 9px 14px;
    font-size: 13px;
  }
`;

const Hero = styled.section`
  padding: 130px 24px 84px;
`;

const HeroInner = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 34px;
  align-items: center;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const HeroLeft = styled.div`
  animation: ${fadeUp} 0.55s ease both;
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-accent-light);
  color: var(--color-accent-dark);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  margin-bottom: 18px;
`;

const HeroTitle = styled.h1`
  font-size: clamp(40px, 6vw, 72px);
  line-height: 1.07;
  letter-spacing: -0.04em;
  color: var(--color-text-primary);
  margin-bottom: 18px;

  .accent {
    background: linear-gradient(135deg, var(--color-accent-dark), var(--color-accent), var(--color-accent-bright));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const HeroSub = styled.p`
  font-size: 18px;
  line-height: 1.7;
  color: var(--color-text-secondary);
  max-width: 600px;
  margin-bottom: 28px;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 22px;
`;

const PrimaryBtn = styled.button`
  padding: 14px 28px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-bright));
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  box-shadow: 0 14px 26px rgba(74, 156, 93, 0.24);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 32px rgba(74, 156, 93, 0.28);
  }
`;

const SecondaryBtn = styled.button`
  padding: 14px 26px;
  border-radius: 14px;
  background: #fff;
  border: 1.5px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 16px;
  font-weight: 600;

  &:hover {
    border-color: var(--color-accent);
    color: var(--color-accent-dark);
  }
`;

const HeroTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const HeroTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  background: var(--color-accent-light);
`;

const HeroRight = styled.div`
  animation: ${fadeUp} 0.55s ease 0.1s both;
`;

const PreviewCard = styled.div`
  background: linear-gradient(160deg, #ffffff, var(--color-bg-secondary) 60%, var(--color-accent-light));
  border: 1px solid var(--color-border);
  border-radius: 26px;
  padding: 22px;
  box-shadow: 0 22px 40px rgba(53, 122, 69, 0.16);
  position: relative;

  &::after {
    content: "";
    position: absolute;
    right: -10px;
    top: -10px;
    width: 70px;
    height: 70px;
    border-radius: 18px;
    background: linear-gradient(135deg, rgba(74, 156, 93, 0.18), rgba(106, 184, 112, 0.08));
    z-index: 0;
  }
`;

const PreviewHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
`;

const PreviewTitle = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: var(--color-accent-dark);
  letter-spacing: -0.02em;
`;

const PreviewPill = styled.span`
  padding: 6px 10px;
  border-radius: 999px;
  background: var(--color-accent-light);
  color: var(--color-accent);
  border: 1px solid var(--color-border);
  font-size: 11px;
  font-weight: 700;
`;

const PlanDay = styled.div`
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  padding: 12px 12px 10px;
  margin-bottom: 10px;
  position: relative;
  z-index: 1;
`;

const PlanDayTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: var(--color-accent-dark);
  margin-bottom: 8px;
`;

const PlanItem = styled.div`
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 8px;
  font-size: 12px;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin-bottom: 5px;

  b {
    color: var(--color-accent-dark);
  }
`;

const PreviewFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  position: relative;
  z-index: 1;
`;

const DotRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Dot = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: ${({ $color }) => $color};
`;

const FloatingPlane = styled.div`
  position: absolute;
  right: 16px;
  bottom: -16px;
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  font-size: 26px;
  background: #fff;
  border: 1px solid var(--color-border);
  box-shadow: 0 12px 22px rgba(53, 122, 69, 0.18);
  animation: ${float} 3.4s ease-in-out infinite;
`;

const Metrics = styled.section`
  padding: 4px 24px 78px;
`;

const MetricsInner = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 580px) {
    grid-template-columns: 1fr;
  }
`;

const MetricCard = styled.div`
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 18px 16px;
  box-shadow: var(--shadow-sm);
`;

const MetricValue = styled.div`
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--color-accent-dark);
`;

const MetricLabel = styled.p`
  margin-top: 4px;
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.4;
`;

const Section = styled.section<{ $bg?: string }>`
  padding: 92px 24px;
  background: ${({ $bg }) => $bg ?? "transparent"};
`;

const SectionInner = styled.div`
  max-width: 1180px;
  margin: 0 auto;
`;

const SectionTop = styled.div`
  margin-bottom: 34px;
`;

const SectionBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 999px;
  background: var(--color-accent-light);
  border: 1px solid var(--color-border);
  color: var(--color-accent);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 14px;
`;

const SectionTitle = styled.h2`
  font-size: clamp(30px, 4vw, 48px);
  line-height: 1.18;
  letter-spacing: -0.03em;
  color: var(--color-text-primary);
  margin-bottom: 10px;
`;

const SectionDesc = styled.p`
  font-size: 16px;
  color: var(--color-text-secondary);
  line-height: 1.7;
  max-width: 640px;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  padding: 22px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0 0 auto 0;
    height: 3px;
    background: linear-gradient(90deg, var(--color-accent-bright), var(--color-accent), var(--color-accent-dark));
  }
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--color-accent-light);
  border: 1px solid var(--color-border);
  display: grid;
  place-items: center;
  font-size: 24px;
  margin-bottom: 14px;
`;

const FeatureTitle = styled.h3`
  font-size: 19px;
  font-weight: 800;
  color: var(--color-accent-dark);
  margin-bottom: 8px;
`;

const FeatureDesc = styled.p`
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text-secondary);
`;

const FlowGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 580px) {
    grid-template-columns: 1fr;
  }
`;

const FlowCard = styled.div`
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 18px;
`;

const FlowIndex = styled.span`
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-bright));
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  margin-bottom: 12px;
`;

const FlowTitle = styled.h4`
  font-size: 16px;
  font-weight: 800;
  color: var(--color-accent-dark);
  margin-bottom: 7px;
`;

const FlowDesc = styled.p`
  font-size: 13.5px;
  color: var(--color-text-secondary);
  line-height: 1.6;
`;

const CtaSection = styled.section`
  padding: 40px 24px 92px;
`;

const CtaCard = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  border-radius: 24px;
  border: 1px solid var(--color-border);
  background: linear-gradient(120deg, #ffffff 0%, var(--color-bg) 46%, var(--color-accent-light) 100%);
  padding: 42px 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  @media (max-width: 900px) {
    flex-direction: column;
    text-align: center;
  }
`;

const CtaLeft = styled.div`
  h3 {
    font-size: clamp(28px, 4vw, 44px);
    color: var(--color-text-primary);
    letter-spacing: -0.03em;
    margin-bottom: 8px;
  }

  p {
    font-size: 16px;
    color: var(--color-text-secondary);
  }
`;

const Footer = styled.footer`
  border-top: 1px solid var(--color-border);
  background: #fff;
  padding: 22px 24px;
`;

const FooterInner = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

const FooterLogo = styled.img`
  width: 128px;
  height: auto;
`;

const FooterCopy = styled.p`
  font-size: 13px;
  color: var(--color-text-muted);
`;

const FEATURES = [
  {
    icon: "🤖",
    title: "AI 일정 생성",
    desc: "AI가 여행 스타일, 날짜, 선호도를 분석해 최적의 맞춤 일정을 자동으로 생성해드립니다.",
  },
  {
    icon: "🗺️",
    title: "실제 장소 기반 추천",
    desc: "한국관광공사 TourAPI 데이터를 바탕으로 실제 방문 가능한 장소 중심으로 일정을 구성합니다.",
  },
  {
    icon: "📍",
    title: "동선 중심 일정",
    desc: "생성된 계획을 지도로 시각화해 이동 흐름을 바로 확인하고 일정 실행까지 빠르게 연결합니다.",
  },
];

const STEPS = [
  { n: "01", title: "조건 입력", desc: "날짜, 지역, 이동수단과 여행 스타일을 입력합니다." },
  { n: "02", title: "요청 추가", desc: "원하는 분위기나 특별한 요청을 자유롭게 남깁니다." },
  { n: "03", title: "일정 생성", desc: "AI가 장소와 동선을 조합해 일자별 계획을 완성합니다." },
  { n: "04", title: "지도 확인", desc: "추천 일정을 지도에서 확인하고 그대로 실행하면 끝입니다." },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const goPlan = () => navigate("/plan");

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Page>
      <Nav>
        <NavLogo onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <NavLogoImage src="/brand/PLANDL_horizontal_logo.png" alt="PLANDL 로고" />
        </NavLogo>

        <NavRight>
          <NavLink onClick={() => scrollTo("features")}>서비스 소개</NavLink>
          <NavLink onClick={() => scrollTo("how-to")}>사용 방법</NavLink>
          <NavCta onClick={goPlan}>지금 시작하기</NavCta>
        </NavRight>
      </Nav>

      <Hero>
        <HeroInner>
          <HeroLeft>
            <HeroBadge>TRIP PLANNING REIMAGINED</HeroBadge>
            <HeroTitle>
              검색 대신,
              <br />
              <span className="accent">완성된 여행 계획</span>
            </HeroTitle>
            <HeroSub>
              PLANDL은 입력한 조건을 바탕으로 일정과 동선을 한 번에 구성합니다.
              고민은 줄이고, 바로 떠날 수 있는 계획을 만드세요.
            </HeroSub>

            <HeroButtons>
              <PrimaryBtn onClick={goPlan}>✨ 일정 만들기</PrimaryBtn>
              <SecondaryBtn onClick={() => scrollTo("features")}>서비스 살펴보기</SecondaryBtn>
            </HeroButtons>

            <HeroTags>
              <HeroTag>AI 맞춤 일정</HeroTag>
              <HeroTag>실제 장소 데이터</HeroTag>
              <HeroTag>지도 기반 동선</HeroTag>
              <HeroTag>간편한 채팅 입력</HeroTag>
            </HeroTags>
          </HeroLeft>

          <HeroRight>
            <PreviewCard>
              <PreviewHead>
                <PreviewTitle>부산 2박 3일</PreviewTitle>
                <PreviewPill>자동 생성 완료</PreviewPill>
              </PreviewHead>

              <PlanDay>
                <PlanDayTitle>Day 1</PlanDayTitle>
                <PlanItem>
                  <b>10:00</b>
                  <span>해운대 해변 산책 · 브런치</span>
                </PlanItem>
                <PlanItem>
                  <b>14:00</b>
                  <span>감천문화마을 · 포토스팟</span>
                </PlanItem>
                <PlanItem>
                  <b>18:30</b>
                  <span>광안리 야경 + 저녁 코스</span>
                </PlanItem>
              </PlanDay>

              <PlanDay>
                <PlanDayTitle>Day 2</PlanDayTitle>
                <PlanItem>
                  <b>09:30</b>
                  <span>송정 카페 라인 · 바다뷰</span>
                </PlanItem>
                <PlanItem>
                  <b>13:00</b>
                  <span>태종대 코스 · 전망 포인트</span>
                </PlanItem>
                <PlanItem>
                  <b>19:00</b>
                  <span>남포동 맛집 투어</span>
                </PlanItem>
              </PlanDay>

              <PreviewFooter>
                <DotRow>
                  <Dot $color="var(--color-accent-dark)" />
                  <Dot $color="var(--color-accent)" />
                  <Dot $color="var(--color-accent-bright)" />
                </DotRow>
                <PreviewPill>지도 동선 포함</PreviewPill>
              </PreviewFooter>

              <FloatingPlane>✈️</FloatingPlane>
            </PreviewCard>
          </HeroRight>
        </HeroInner>
      </Hero>

      <Metrics>
        <MetricsInner>
          <MetricCard>
            <MetricValue>1분 내</MetricValue>
            <MetricLabel>첫 일정 초안 생성</MetricLabel>
          </MetricCard>
          <MetricCard>
            <MetricValue>실제 데이터</MetricValue>
            <MetricLabel>TourAPI 기반 장소 추천</MetricLabel>
          </MetricCard>
          <MetricCard>
            <MetricValue>지도 연동</MetricValue>
            <MetricLabel>카카오맵 동선 확인</MetricLabel>
          </MetricCard>
          <MetricCard>
            <MetricValue>대화형 입력</MetricValue>
            <MetricLabel>원하는 스타일 직접 반영</MetricLabel>
          </MetricCard>
        </MetricsInner>
      </Metrics>

      <Section id="features" $bg="var(--color-accent-light)">
        <SectionInner>
          <SectionTop>
            <SectionBadge>FEATURES</SectionBadge>
            <SectionTitle>PLANDL이 계획을 완성하는 방식</SectionTitle>
            <SectionDesc>
              단순 추천이 아니라, 실제 장소 데이터와 AI를 조합해 바로 실행 가능한 계획을 제공합니다.
            </SectionDesc>
          </SectionTop>

          <FeatureGrid>
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title}>
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDesc>{feature.desc}</FeatureDesc>
              </FeatureCard>
            ))}
          </FeatureGrid>
        </SectionInner>
      </Section>

      <Section id="how-to">
        <SectionInner>
          <SectionTop>
            <SectionBadge>HOW TO USE</SectionBadge>
            <SectionTitle>복잡한 계획도 4단계면 끝</SectionTitle>
            <SectionDesc>
              빠르게 입력하고, 검토하고, 바로 떠나세요. 준비 시간을 아껴 실제 여행에 더 집중할 수 있습니다.
            </SectionDesc>
          </SectionTop>

          <FlowGrid>
            {STEPS.map((step) => (
              <FlowCard key={step.n}>
                <FlowIndex>{step.n}</FlowIndex>
                <FlowTitle>{step.title}</FlowTitle>
                <FlowDesc>{step.desc}</FlowDesc>
              </FlowCard>
            ))}
          </FlowGrid>
        </SectionInner>
      </Section>

      <CtaSection>
        <CtaCard>
          <CtaLeft>
            <h3>이제 여행 계획은 PLANDL로</h3>
            <p>입력하면 완성되는 맞춤 일정, 지금 바로 경험해보세요.</p>
          </CtaLeft>
          <PrimaryBtn onClick={goPlan}>🚀 무료로 시작하기</PrimaryBtn>
        </CtaCard>
      </CtaSection>

      <Footer>
        <FooterInner>
          <FooterLogo src="/brand/PLANDL_horizontal_logo.png" alt="PLANDL 로고" />
          <FooterCopy>© 2026 PLANDL. AI 기반 여행 일정 플래너</FooterCopy>
        </FooterInner>
      </Footer>
    </Page>
  );
};

export default LandingPage;
