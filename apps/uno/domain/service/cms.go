package service

import (
	"uno/domain/port"
)

type CMSService struct {
	happeningRepo          port.CMSHappeningRepo
	repeatingHappeningRepo port.CMSRepeatingHappeningRepo
	postRepo               port.CMSPostRepo
	studentGroupRepo       port.CMSStudentGroupRepo
	jobAdRepo              port.CMSJobAdRepo
	bannerRepo             port.CMSBannerRepo
	staticInfoRepo         port.CMSStaticInfoRepo
	merchRepo              port.CMSMerchRepo
	meetingMinuteRepo      port.CMSMeetingMinuteRepo
	movieRepo              port.CMSMovieRepo
	hsApplicationRepo      port.CMSHSApplicationRepo
}

func NewCMSService(
	happeningRepo port.CMSHappeningRepo,
	repeatingHappeningRepo port.CMSRepeatingHappeningRepo,
	postRepo port.CMSPostRepo,
	studentGroupRepo port.CMSStudentGroupRepo,
	jobAdRepo port.CMSJobAdRepo,
	bannerRepo port.CMSBannerRepo,
	staticInfoRepo port.CMSStaticInfoRepo,
	merchRepo port.CMSMerchRepo,
	meetingMinuteRepo port.CMSMeetingMinuteRepo,
	movieRepo port.CMSMovieRepo,
	hsApplicationRepo port.CMSHSApplicationRepo,
) *CMSService {
	return &CMSService{
		happeningRepo:          happeningRepo,
		repeatingHappeningRepo: repeatingHappeningRepo,
		postRepo:               postRepo,
		studentGroupRepo:       studentGroupRepo,
		jobAdRepo:              jobAdRepo,
		bannerRepo:             bannerRepo,
		staticInfoRepo:         staticInfoRepo,
		merchRepo:              merchRepo,
		meetingMinuteRepo:      meetingMinuteRepo,
		movieRepo:              movieRepo,
		hsApplicationRepo:      hsApplicationRepo,
	}
}

func (s *CMSService) HappeningRepo() port.CMSHappeningRepo          { return s.happeningRepo }
func (s *CMSService) RepeatingHappeningRepo() port.CMSRepeatingHappeningRepo {
	return s.repeatingHappeningRepo
}
func (s *CMSService) PostRepo() port.CMSPostRepo                    { return s.postRepo }
func (s *CMSService) StudentGroupRepo() port.CMSStudentGroupRepo    { return s.studentGroupRepo }
func (s *CMSService) JobAdRepo() port.CMSJobAdRepo                  { return s.jobAdRepo }
func (s *CMSService) BannerRepo() port.CMSBannerRepo                { return s.bannerRepo }
func (s *CMSService) StaticInfoRepo() port.CMSStaticInfoRepo        { return s.staticInfoRepo }
func (s *CMSService) MerchRepo() port.CMSMerchRepo                  { return s.merchRepo }
func (s *CMSService) MeetingMinuteRepo() port.CMSMeetingMinuteRepo  { return s.meetingMinuteRepo }
func (s *CMSService) MovieRepo() port.CMSMovieRepo                  { return s.movieRepo }
func (s *CMSService) HSApplicationRepo() port.CMSHSApplicationRepo  { return s.hsApplicationRepo }
