import unittest
from unittest.mock import patch

from app import ai, main
from app.schemas import FrontPlanRequest, Plan, PlaceCandidate, TravelDay


class PlanLogicTests(unittest.TestCase):
    def test_local_edit_handles_remove_and_add_in_single_sentence(self):
        current_schedule = [
            {
                "day": "Day 1",
                "date": "2026-03-01",
                "plan": [
                    {
                        "order": 1,
                        "place": "해운대해수욕장",
                        "description": "",
                        "activity": "",
                        "address": "부산 해운대구",
                        "image": "",
                        "latitude": 35.1,
                        "longitude": 129.1,
                    },
                    {
                        "order": 2,
                        "place": "광안리해수욕장",
                        "description": "",
                        "activity": "",
                        "address": "부산 수영구",
                        "image": "",
                        "latitude": 35.1,
                        "longitude": 129.1,
                    },
                ],
            },
            {
                "day": "Day 2",
                "date": "2026-03-02",
                "plan": [
                    {
                        "order": 1,
                        "place": "감천문화마을",
                        "description": "",
                        "activity": "",
                        "address": "부산 사하구",
                        "image": "",
                        "latitude": 35.0,
                        "longitude": 129.0,
                    }
                ],
            },
        ]
        places = [
            PlaceCandidate(
                title="해운대해수욕장",
                addr1="부산 해운대구",
                firstimage="",
                mapy=35.1,
                mapx=129.1,
            )
        ]

        result = ai.apply_schedule_edit_locally(
            user_input="광안리 빼고 2째날에 해운대 넣어줘",
            current_schedule=current_schedule,
            places=places,
        )

        self.assertIsNotNone(result)
        self.assertIn("삭제", result.text)
        self.assertIn("추가", result.text)
        self.assertEqual(
            [p.place for p in result.travelSchedule[1].plan],
            ["감천문화마을", "해운대해수욕장"],
        )

    def test_type_mapping_supports_festival_label(self):
        self.assertEqual(main._pick_content_type_ids("축제 / 공연 / 행사"), [15])
        self.assertEqual(main._pick_content_type_ids(["맛집", "문화시설"]), [39, 14])

    def test_edit_request_uses_local_edit_without_regenerating(self):
        req = FrontPlanRequest(
            userInput="해운대 빼줘",
            date="2026-03-01 ~ 2026-03-02",
            region="부산",
            travelType="관광",
            transportation="자가용",
            companions="친구들",
            pace="보통",
            currentSchedule=[
                TravelDay(
                    day="Day 1",
                    date="2026-03-01",
                    plan=[
                        Plan(
                            order=1,
                            place="해운대",
                            description="",
                            activity="",
                            address="부산",
                            image="",
                            latitude=35.1,
                            longitude=129.1,
                        )
                    ],
                )
            ],
        )

        with patch("app.main.build_plan_from_front") as mock_build:
            response = main.plan(req)
            mock_build.assert_not_called()

        self.assertEqual(len(response.travelSchedule[0].plan), 0)
        self.assertIn("삭제", response.text)


if __name__ == "__main__":
    unittest.main()
